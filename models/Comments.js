const jsend = require('jsend')
const database = require('../services/Database')

const translate = require('../utils/Translator')

class Comments {
	async findCommentsByPost(id) {
		try {
			const sql_commentsByPost = `
				SELECT
					 pc.id_comment,
					 pc.id_post,
					 pc.text_comment,
					 pc.date_comment,
					 u.id_user,
					 u.first_name_user,
					 u.last_name_user,
					 u.photo_user
				FROM post_comment AS pc
				INNER JOIN user AS u ON u.id_user = pc.id_user
				WHERE pc.id_post = ?
				ORDER BY pc.date_comment DESC`
			const allCommentsFromPost = await database.instance.query(sql_commentsByPost, [id])

			return jsend.success({ comments: allCommentsFromPost })
		} catch(error) {
			console.log(error)
			return jsend.error(translate.instance.translate("error_comments_get"))
		}
	}

	async save(comment) {
		let userPosting;

		try {
			const sql_findUser = `
				SELECT
					photo_user,
					first_name_user,
					last_name_user
				FROM user
				WHERE id_user = ?
				LIMIT 1`
			userPosting = await database.instance.query(sql_findUser, [comment.id_user])

			if(!Object.keys(userPosting).length)
				return jsend.error(translator.instance.translate('error_account_unknown'))
		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_account_checking'))
		}

		try {
			const sql_saveComment = 'INSERT INTO post_comment SET ?'
			const resultSaveComment = await database.instance.query(sql_saveComment, [comment])

			return jsend.success({ result: true })
		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_comments_save'))
		}
	}

	async deleteByPost(id, idUser, idComment) {
		try {
			let sql_deleteComment = `DELETE FROM post_comment WHERE id_user = ? AND id_post = ? AND id_comment = ?`
			const deleteCommentResult = await database.instance.query(sql_deleteComment, [idUser, id, idComment])

			if(deleteCommentResult.affectedRows < 1)
				return jsend.error(translator.instance.translate('error_comments_not_found'))

			return jsend.success({result: true})
		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_comments_delete'))
		}
	}
}

module.exports = Comments