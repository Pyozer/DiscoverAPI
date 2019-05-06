exports.check_follow_user = (req,res)  => {

	let id_to_follow = req.params.id_user;
	let id_user = req.user;

    // On vérifie si notre bdd mysql fonctionne
    pool.getConnection((err, connection) => {
    	if(err) {
    		connection.release();
    		return onDatabaseConError(res);
    	}

    	connection.query('SELECT * FROM friend WHERE (id_user_origin = ? AND id_user_dest = ?)', [id_user, id_to_follow],  (error, resultsUser, fields)  => {
			connection.release();
			if (error) {
				return onDatabaseReqError(res, getString("error_database_check_follow"));
			}

			if(resultsUser.length > 0) {
				return res.status(200).send(jsend.success({ statusFollow: true }));
			} else {
				return res.status(200).send(jsend.success({ statusFollow: false }));
			}
		});
    });
}
exports.follow_user = (req,res)  => {

	let id_user_dest = req.params.id_user;
	let id_user = req.user;

    // On vérifie si notre bdd mysql fonctionne
    pool.getConnection((err, connection) => {
    	if(err) {
    		connection.release();
    		return onDatabaseConError(res);
    	}

    	connection.query('SELECT * FROM friend WHERE (id_user_origin = ? AND id_user_dest = ?)', [id_user, id_user_dest],  (error, resultsUser, fields)  => {
			if (error) {
				connection.release();
				return onDatabaseReqError(res, getString("error_database_check_follow"));
			}

			if(resultsUser.length > 0) {
				connection.query('DELETE FROM friend WHERE id_user_origin = ? AND id_user_dest = ?', [id_user, id_user_dest],  (error, results, fields)  => {
			    	connection.release();
					if (error) {
						return onDatabaseReqError(res, getString("error_friends_unfollow"));
					}

					return res.status(200).send(jsend.success({ statusFollow: false }));
				});
			} else {

				let data = {
					id_user_origin: id_user,
					id_user_dest: id_user_dest
				}

			    connection.query('INSERT INTO friend SET ?', [data],  (error, results, fields)  => {
			    	connection.release();
					if (error) {
						return onDatabaseReqError(res, getString("error_friends_follow"));
					}

					return res.status(200).send(jsend.success({ statusFollow: true }));
				});
			}
		});
    });
}