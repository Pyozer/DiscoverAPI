require('dotenv').config
const mail = require('../services/email')

mail.instance.sendEmail()
