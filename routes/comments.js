exports.get_posts_comments = (req, res) => {

	let id_post = req.params.id_post;

	pool.getConnection((err, connection)  => {
		if(err) {
			connection.release();
			return onDatabaseConError(res);
		}

		let sql = "SELECT pc.id_comment, pc.id_post, pc.text_comment, pc.date_comment, u.id_user, u.first_name_user, u.last_name_user, u.photo_user FROM post_comment AS pc" +
			" INNER JOIN user AS u ON u.id_user = pc.id_user" +
			" WHERE pc.id_post = ?" +
			" ORDER BY pc.date_comment DESC";

		connection.query(sql, [id_post],  (error, results, fields)  => {
			connection.release();
			if (error) {
				return onDatabaseReqError(res, getString("error_comments_get"));
			} else {
				return res.status(200).send(jsend.success({ comments: results }));
			}
	    });
    });
}

exports.save_post_comment = (req,res) => {

	let id_user = req.user;
	let id_post = req.params.id_post;
	let text_comment = req.body.text_comment;

	pool.getConnection((err, connection)  => {
		if(err) {
			connection.release();
			return onDatabaseConError(res);
		}

		let comment = {
			id_post: id_post,
			id_user: id_user,
			text_comment: text_comment,
			date_comment: new Date().toISOString().slice(0, 19).replace('T', ' ')
		}

		connection.query('SELECT photo_user, first_name_user, last_name_user FROM user WHERE id_user = ? LIMIT 1', [comment.id_user],  (error, resultUser, fields)  => {
			if (error) {
				connection.release();
				return onDatabaseReqError(res,getString("error_account_checking"));
			}

			if(resultUser.length == 0) {
				connection.release();
				return res.status(400).send(jsend.error(getString("error_account_unknown")));
			}

			connection.query("INSERT INTO post_comment SET ?", [comment],  (error, results, fields)  => {
				connection.release();
				if (error) {
					return onDatabaseReqError(res, getString("error_comments_save"));
				} else {
					comment.id_comment = results.insertId;

					comment.first_name_user = resultUser[0].first_name_user;
					comment.last_name_user = resultUser[0].last_name_user;
					comment.photo_user = resultUser[0].photo_user;

					return res.status(200).send(jsend.success({ comments: [comment] }));
				}
			});
	    });
    });
}

exports.delete_post_comment = (req,res) => {

	let id_user = req.user;
	let id_post = req.params.id_post;
	let id_comment = req.params.id_comment;

	pool.getConnection((err, connection)  => {
		if(err) {
			connection.release();
			return onDatabaseConError(res);
		}

		connection.query("DELETE FROM post_comment WHERE id_user = ? AND id_post = ? AND id_comment = ? ", [id_user, id_post, id_comment],  (error, results, fields)  => {
			connection.release();
			if (error) {
				return onDatabaseReqError(res, getString("error_comments_delete"));
			}
			if(results.affectedRows < 1) {
				return onDatabaseReqError(res, getString("error_comments_not_found"));
			}

			return res.status(200).send(jsend.success(true));
	    });
    });
}