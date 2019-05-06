const bcrypt      = require('bcryptjs');
const multiparty  = require('multiparty');
const fs          = require('fs');

exports.get_profile_info = (req, res)  => {

	let id_user = req.params.id_user;

    // On vérifie si notre bdd mysql fonctionne
    pool.getConnection((err, connection) => {
    	if(err) {
    		connection.release();
    		return onDatabaseConError(res);
    	}

    	let query = "SELECT " + 
    					"(SELECT COUNT(id_post) FROM post WHERE post.id_user = ?) as posts, " +
    					"(SELECT COUNT(id_user_origin) FROM friend WHERE id_user_origin = ?) as followings, " +
    					"(SELECT COUNT(id_user_dest) FROM friend WHERE id_user_dest = ?) as followers, " +
    					"id_user, " +
                        "email_user," + 
    					"first_name_user, " +
    					"last_name_user, " +
    					"photo_user " +
    					"FROM user WHERE id_user = ?";

    	connection.query(query, [id_user, id_user, id_user, id_user],  (error, results, fields)  => {
            connection.release();
			if (error) {
				return onDatabaseReqError(res, getString("error_database_profile_get"));
			}

            if(results.length == 0) {
                return res.status(204).send(jsend.error(getString("error_account_unknown")));
            }

			res.status(200).send(jsend.success(results[0]));
		});
    });
}

exports.edit_profile_img = (req, res)  => {

    let id_user = req.params.id_user;

    pool.getConnection((err, connection)  => {
        if(err) {
            connection.release();
            return onDatabaseConError(res);
        }

        connection.query("SELECT photo_user FROM user WHERE id_user = ?", [id_user],  (error, results, fields)  => {
            if (error) {
                connection.release();
                return onDatabaseReqError(res, getString("error_database_profile_get"));
            }

            if(results.length == 0) {
                connection.release();
                return res.status(204).send(jsend.error(getString("error_account_unknown")));
            }

            images.delete_image("profils/", results[0].photo_user, res, (error)  => {
                /*if(error){
                    connection.release();
                    return onDatabaseReqError(res, getString("error_image_delete"));
                }*/

                images.upload_image(req, res, "profils", (error, filename)  => {
                    if(error) {
                        connection.release();
                        return onDatabaseReqError(res, getString("error_image_upload"));
                    }

                    connection.query("UPDATE user SET photo_user = ? WHERE id_user = ?", [filename, id_user],  (error, results, fields)  => {
                        connection.release();
                        if (error) {
                            return onDatabaseReqError(res, getString("error_account_update_img"));
                        }

                        res.status(200).send(jsend.success(filename));
                    });
                });
            });
        });
    });
}


exports.edit_profile_email = (req, res)  => {

    let id_user = req.params.id_user;
    let email_user = req.body.email_user;

    // Si l'id qui veut être modifié c'est pas le même que celui connecté
    if(req.user != id_user) {
        return res.status(403).send(jsend.error(getString("error_access_denied")));
    }

    // On vérifie si notre bdd mysql fonctionne
    pool.getConnection((err, connection) => {
        if(err) {
            connection.release();
            return onDatabaseConError(res);
        }

        connection.query("UPDATE user SET email_user = ? WHERE id_user = ?", [email_user, id_user],  (error, results, fields)  => {
            connection.release();
            if (error) {
                return onDatabaseReqError(res, getString("error_account_update_email"));
            }

            res.status(200).send(jsend.success(email_user));
        });
    });
}

exports.edit_profile_password = (req, res)  => {

    let id_user = req.params.id_user;
    let new_password_user = req.body.new_password_user;
    let actual_password_user = req.body.password_user;

    // Si l'id qui veut être modifié c'est pas le même que celui connecté
    if(req.user != id_user) {
        return res.status(403).send(jsend.error(getString("error_access_denied")));
    }

    // On vérifie si notre bdd mysql fonctionne
    pool.getConnection((err, connection) => {
        if(err) {
            connection.release();
            return onDatabaseConError(res);
        }

        connection.query("SELECT password_user FROM user WHERE id_user = ? LIMIT 1", [id_user],  (error, results, fields)  => {
            if (error) {
                return onDatabaseReqError(res, getString("error_account_checking"));
            }

            // Si le mot de passe actuel saisie est faux
            if(!bcrypt.compareSync(actual_password_user, results[0].password_user)) {
                return res.status(403).send(jsend.error(getString("error_account_old_pwd")));
            }

            // Chiffrement du nouveau mdp
            let password_hash_user = bcrypt.hashSync(new_password_user, 10);

            connection.query("UPDATE user SET password_user = ? WHERE id_user = ?", [password_hash_user, id_user],  (error, results, fields)  => {
                connection.release();
                if (error) {
                    return onDatabaseReqError(res, getString("error_account_update_pwd"));
                }

                res.status(200).send(jsend.success(true));
            });
        });
    });
}

exports.edit_profile_position = (req, res)  => {

    let id_user = req.params.id_user;
    let pos_lat_user = req.body.pos_lat_user;
    let pos_long_user = req.body.pos_long_user;
	console.log(id_user, pos_lat_user, pos_long_user);
    // Si l'id qui veut être modifié c'est pas le même que celui connecté
    if(req.user != id_user) {
        return res.status(403).send(jsend.error(getString("error_access_denied")));
    }

    // On vérifie si notre bdd mysql fonctionne
    pool.getConnection((err, connection) => {
        if(err) {
            connection.release();
            return onDatabaseConError(res);
        }

        connection.query("UPDATE user SET pos_lat_user = ?, pos_long_user = ? WHERE id_user = ?", [pos_lat_user, pos_long_user, id_user],  (error, results, fields)  => {
            connection.release();
            if (error) {
                return onDatabaseReqError(res, getString("error_account_update_position"));
            }

            res.status(200).send(jsend.success({
                pos_lat_user: pos_lat_user,
                pos_long_user: pos_long_user
            }));
        });
    });
}
