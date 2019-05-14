class Email {

	constructor(){
		this.api_key = process.env.MAILGUN_API_KEY
		this.domain = process.env.MAILGUN_DOMAIN
		this.mailgun = require('mailgun-js')({
		  apiKey: api_key,
		  domain: domain
		});
	}

	send_mail(mailTo="adam.louis28@gmail.com", subject="Creation de compte", text="Bravo c'est créer", mailFrom="adam.louis28@gmail.com"){
		let data = {
		  from: mailFrom,
		  to: mailTo,
		  subject: subject,
		  text: text
		};

		mailgun.messages().send(data, function (error, body) {
		  console.log('body: ', body)
		})
	}

	getInstance(){
		if (!this.instance){
			this.instance = new Email()
		}
		return this.instance;
	}
}

module.exports = Email
