const Mailgun = require('mailgun-js')
const EMAIL_KEY = Symbol('email')

class Email {
	constructor() {
		try {
			this.mailgun = new Mailgun({
			 apiKey: process.env.MAILGUN_API_KEY,
			 domain: process.env.MAILGUN_DOMAIN,
			})
		} catch(error) {
			console.log(error)
		}
	}

	async sendEmail(to, subject, text) {
		try {
			const emailOptions = {
				from: 'adam.louis28@gmail.com',
				to,
				subject,
				text
			}

			const emailSentResponse = await this.mailgun.messages().send(emailOptions)
			console.log(emailSentResponse)
		} catch(error) {
			console.log(error)
		}
	}
}

global[EMAIL_KEY] = new Email()

var singleton = {}
Object.defineProperty(singleton, "instance", {
  get: function(){
    return global[EMAIL_KEY]
  },
  enumerable: true
})
Object.freeze(singleton)

module.exports = singleton