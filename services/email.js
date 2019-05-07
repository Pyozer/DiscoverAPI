const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: server_email,
		pass: 'pts3g9discover'
	}
});

exports.sendEmail = (email_from, email_dest, subject, content, callback) => {
	let mailOptions = {
		from: email_from,
		to: email_dest,
		subject: subject,
		text: content
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error)
			callback(error, null);
		else
			callback(null, info);
	});
}