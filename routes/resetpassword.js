const bcrypt = require('bcryptjs');
const uuidv1 = require('uuid/v1');

exports.sendResetToken =  (req, res) => {

	let email_user = req.body.email_user;

	// On vérifie si notre bdd mysql fonctionne
	pool.getConnection( (err, connection) => {
		if (err) {
			connection.release();
			return onDatabaseConError(res);
		}

		connection.query('SELECT * FROM user WHERE email_user = ? LIMIT 1', [email_user],  (error, resultUser, fields)  => {
			if (error) {
				connection.release();
				return onDatabaseReqError(res, getString("error_database_check_account"));
			}

			if (resultUser.length == 0) {
				connection.release();
				return onDatabaseReqError(res, getString("error_no_account"));
			}

			let uniqToken = uuidv1();
			let resetToken = uniqToken.split("-")[0].substring(0, 6);

			let resetpasswordData = {
				id_user: resultUser[0].id_user,
				token_reset: resetToken
			}

			connection.query('INSERT INTO reset_password SET ?', [resetpasswordData],  (error, results, fields)  => {
				connection.release();
				if (error) {
					return onDatabaseReqError(res, getString("error_reset_pwd_create"));
				}

				email.sendEmail(server_email, email_user, 'Discover - Reset password key', getString("mail_reset_pwd", [resetToken]),  (error, info)  => {
					if (error) {
						return onDatabaseReqError(res, getString("error_database_email_send"));
					} else {
						console.log('Reset password email sent: ' + info.response);
						return res.status(200).send(jsend.success(true));
					}
				});
			});
		});
	});
}

exports.changeUserPassword =  (req, res)  => {

	let tokenReset = req.body.token_reset;
	let new_password = req.body.password_user;

	// On vérifie si notre bdd mysql fonctionne
	pool.getConnection( (err, connection)  => {
		if (err) {
			connection.release();
			return onDatabaseConError(res);
		}

		connection.query('SELECT id_user FROM reset_password WHERE token_reset = ? LIMIT 1', [tokenReset],  (error, resultReset, fields)  => {
			if (error) {
				connection.release();
				return onDatabaseReqError(res, getString("error_reset_token_check"));
			}

			if (resultReset.length == 0) {
				connection.release();
				return onDatabaseReqError(res, getString("error_reset_token_unknown"));
			}

			connection.query('DELETE FROM reset_password WHERE token_reset = ?', [tokenReset],  (error, results, fields)  => {
				if (error) {
					console.log("Delete reset password token failed", error);
				}
			});

			// On crypte le mot de passe
			new_password = bcrypt.hashSync(new_password, 10);
			let id_user = resultReset[0].id_user;

			connection.query('UPDATE user SET password_user = ? WHERE id_user = ?', [new_password, id_user],  (error, results, fields)  => {
				connection.release();

				if (error) {
					return onDatabaseReqError(res, getString("error_reset_pwd_update"));
				}

				return res.status(200).send(jsend.success(getString("success_reset_pwd")));
			});
		});
	});
}