const { createTransport } = require('nodemailer');
const EMAIL_KEY = Symbol('email')

class Email {
	constructor() {
		try {
			this.transporter = createTransport({
				service: 'gmail',
				auth: {
					user: 'DiscoverAPI.2019@gmail.com',
					pass: 'Discover2019'
				}
			})
		} catch(error) {
			console.log(error)
		}
	}

	async sendEmail(to, subject, text) {
		try {
			const mailOptions = {
				from: 'DiscoverAPI.2019@gmail.com',
				to,
				subject,
				text
			}

			const sentEmailReponse = await	this.transporter.sendMail(mailOptions)
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