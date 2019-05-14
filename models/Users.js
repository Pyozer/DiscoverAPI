const jsend = require('jsend')
const bcrypt = require('bcrypt')
const uuidv1 = require('uuid/v1')

const database = require('../services/Database')
const email = require('../services/Email')
const translator = require('../utils/Translator')

class Users {
	async register(newUser) {
		try {
			const sql_findUserByEmail = 'SELECT COUNT(1) AS userExist FROM user WHERE email_user = ?'
			const resultUserFound = await database.instance.query(sql_findUserByEmail, [newUser.email_user])

			if(resultUserFound[0].userExist)
				return jsend.error(translator.instance.translate('error_account_already_exist'))

			newUser.password_user = await bcrypt.hash(newUser.password_user, 10)
			newUser.token_user = uuidv1()

			email.instance.sendEmail(newUser.email_user, "Bienvenue sur Discover", "Coucou :)")
		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_account_checking'))
		}

		try {
			const sql_registerUser = 'INSERT INTO user SET ?'
			const resultRegisteringUser = await database.instance.query(sql_registerUser, [newUser])

			const registeredUser = {
				token_user: newUser.token_user,
				id_user: resultRegisteringUser.insertId,
				first_name_user: newUser.first_name_user,
				last_name_user: newUser.last_name_user,
				email_user: newUser.email_user,
				photo_user: newUser.photo_user
			}

			return jsend.success(registeredUser)
 		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_account_save'))
		}
	}

	async login(email, password) {
		let resultUser
		try {
			const sql_findUser = `
				SELECT
					id_user,
					password_user,
					first_name_user,
					last_name_user,
					email_user,
					photo_user
				FROM user
				WHERE email_user = ?
				LIMIT 1`
			resultUser = await database.instance.query(sql_findUser, [email])

			if (resultUser.length == 0)
				return jsend.error(translator.instance.translate('error_no_account'))

			if (!bcrypt.compareSync(password, resultUser[0].password_user))
				return jsend.error(translator.instance.translate('error_account_match'))
		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_account_checking'))
		}

		try {
			const sql_updateLastLogin = 'UPDATE user SET last_login_user = NOW(), token_user = ? WHERE id_user = ?'
			const token = uuidv1()
			const resultUpdateUser = await database.instance.query(sql_updateLastLogin, [token, resultUser[0].id_user])

			return jsend.success({
				token_user: token,
				id_user: resultUser[0].id_user,
				first_name_user: resultUser[0].first_name_user,
				last_name_user: resultUser[0].last_name_user,
				email_user: resultUser[0].email_user,
				photo_user: resultUser[0].photo_user
			})
		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_account_save'))
		}
	}

	async logout(idUser) {
		try {
			const sql_updateToken = `UPDATE user SET token_user = NULL WHERE id_user = ?`
			const resultUpdatedToken = await database.instance.query(sql_updateToken, [idUser])

			return jsend.success(null)
		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_account_logout'))
		}
	}

	async getProfile(idUser) {
		try {
			const sql_findProfile = `
			SELECT
				(SELECT COUNT(id_post) FROM post WHERE post.id_user = ?) as posts,
				id_user,
				email_user,
				first_name_user,
				last_name_user,
				photo_user
			FROM user
			WHERE id_user = ?`
			const resultProfile = await database.instance.query(sql_findProfile, [idUser, idUser])

			if (resultProfile.length == 0)
				return jsend.error(translator.instance.translate('error_account_unknown'))

			return jsend.success(resultProfile[0])
		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_database_profile_get'))
		}
	}

	static requireLogin(req, res, next) {
		if(req.user) {
			next()
		} else {
			res.status(401).send(jsend.error(translator.instance.translate('error_users_unauthorized')))
		}
	}
}

module.exports = Users