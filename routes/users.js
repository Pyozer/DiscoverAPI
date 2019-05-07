const database = require('../services/database/database.js');
let pool = database.instance.getPool();

const bcrypt = require('bcryptjs');
const uuidv1 = require('uuid/v1');

exports.register_user = (req, res) => {
	let newUser = {
		email_user: req.body.email_user,
		password_user: req.body.password_user,
		first_name_user: req.body.first_name_user,
		last_name_user: req.body.last_name_user
	}

	// On vérifie si notre bdd mysql fonctionne
	pool.getConnection((err, connection) => {
		if (err) {
			connection.release();
			return onDatabaseConError(res);
		}

		connection.query('SELECT * FROM user WHERE email_user = ?', [newUser.email_user], (error, resultUser, fields) => {
			if (error) {
				connection.release();
				return onDatabaseReqError(res, getString("error_account_checking"));
			}

			if (resultUser.length > 0) {
				connection.release();
				return onDatabaseReqError(res, getString("error_account_already_exists"));
			}

			// On crypte le mot de passe
			newUser.password_user = bcrypt.hashSync(newUser.password_user, 10);
			// On créer un token
			newUser.token_user = uuidv1();

			connection.query('INSERT INTO user SET ?', [newUser], (error, results, fields) => {
				connection.release();
				if (error) {
					return onDatabaseReqError(res, getString("error_account_save"));
				}

				res.status(200).send(jsend.success({
					token_user: newUser.token_user,
					id_user: results.insertId,
					first_name_user: newUser.first_name_user,
					last_name_user: newUser.last_name_user,
					email_user: newUser.email_user,
					photo_user: newUser.photo_user
				}));
			});
		});
	});
}

exports.login_user = (req, res) => {
	let email_user = req.body.email_user;
	let password_user = req.body.password_user;

	// On vérifie si notre bdd mysql fonctionne
	pool.getConnection((err, connection) => {
		if (err) {
			connection.release();
			return onDatabaseConError(res);
		}

		connection.query('SELECT * FROM user WHERE email_user = ? LIMIT 1', [email_user], (error, resultUser, fields) => {
			if (error) {
				connection.release();
				return onDatabaseReqError(res, getString("error_account_checking"));
			}

			if (resultUser.length == 0) {
				connection.release();
				return onDatabaseReqError(res, getString("error_no_account"));
			}

			if (!bcrypt.compareSync(password_user, resultUser[0].password_user)) {
				connection.release();
				return onDatabaseReqError(res, getString("error_account_match"));
			}

			let token = uuidv1();

			connection.query('UPDATE user SET last_login_user = NOW(), token_user = ? WHERE id_user = ?', [token, resultUser[0].id_user], (error, results, fields) => {
				connection.release();
				if (error) {
					return onDatabaseReqError(res, getString("error_account_update"));
				}

				res.status(200).send(jsend.success({
					token_user: token,
					id_user: resultUser[0].id_user,
					first_name_user: resultUser[0].first_name_user,
					last_name_user: resultUser[0].last_name_user,
					email_user: resultUser[0].email_user,
					photo_user: resultUser[0].photo_user
				}));
			});
		});
	});
}

exports.logout_user = (req, res) => {
	let id_user = req.params.id_user;

	pool.getConnection((err, connection) => {
		if (err) {
			connection.release();
			return onDatabaseConError(res);
		}

		connection.query('UPDATE user SET token_user = NULL WHERE id_user = ?', [id_user], (error, results, fields) => {
			connection.release();
			if (error) {
				return onDatabaseReqError(res, getString("error_users_data_update"));
			}

			res.status(200).send(jsend.success(null));
		});
	});
}

exports.loginRequired = (req, res, next) => {
	if (req.user)
		next();
	else
		return res.status(401).send(jsend.error(getString("error_users_unauthorized")));
}
