const database = require('../services/database/database.js');
let pool = database.instance.getPool();

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
