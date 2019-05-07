const database = require('../services/database/database.js');
let pool = database.instance.getPool();

exports.like = (req, res) => {
	let id_user = req.user;
	let id_post = req.params.id_post;

	pool.getConnection((err, connection) => {
		if (err) {
			connection.release();
			return onDatabaseConError(res);
		}
		connection.query("SELECT * FROM post_like WHERE id_user = ? AND id_post = ?", [id_user, id_post], (error, results, fields) => {
			if (error) {
				connection.release();
				return onDatabaseReqError(res, getString("error_likes_check"));
			} else {
				if (results.length == 0) {
					//Si le poste n'est pas liké, alors le faire
					let like = {
						id_user: id_user,
						id_post: id_post
					}
					connection.query("INSERT INTO post_like SET ?", like, (error, results, fields) => {
						connection.release();
						if (error) {
							return onDatabaseReqError(res, getString("error_likes_save"));
						}
						return res.status(200).send(jsend.success(true));
					});
				} else { //Si le post est deja liké, alors l'enlever
					connection.query("DELETE FROM post_like WHERE id_like = ?", results[0].id_like, (err, result) => {
						connection.release();
						if (error) {
							return onDatabaseReqError(res, getString("error_likes_remove"));
						}
						return res.status(200).send(jsend.success(false));
					});
				}
			}
		});
	});
}
