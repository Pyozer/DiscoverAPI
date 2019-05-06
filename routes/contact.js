exports.sendEmailContact = (req, res)  => {

	let first_name_user = req.body.first_name_user;
	let last_name_user = req.body.last_name_user;
    let email_user = req.body.email_user;
    let subject = req.body.subject_contact;
    let message = req.body.message_contact;

    let finalMsg = first_name_user + "\n" + last_name_user + "\n" + email_user + "\n\n" + subject + "\n" + message;

	email.sendEmail(email_user, server_email, subject, finalMsg, (error, info)  => {
		if (error) {
			return onDatabaseReqError(res, getString("error_database_email_send"));
		} else {
			console.log('Contact email sent: ' + info.response);

			return res.status(200).send(jsend.success(true));
		}
	});
}