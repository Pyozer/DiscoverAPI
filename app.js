const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const translator = require('./utils/Translator')
require('dotenv').config()

const database = require('./services/Database')

app.use(morgan('dev'))

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.use( async (req, res, next) => {
    const lang = req.headers["accept-language"]
		translator.instance.setLangage(lang)

		req.user = undefined
		if (req.headers && req.headers.authorization) {
			const userResult = await database.instance.query('SELECT * FROM user WHERE token_user = ? LIMIT 1', [req.headers.authorization])
			if (userResult.length > 0) {
				req.user = userResult[0]
				next()
			} else {
				next()
			}
		} else {
			next()
		}
})

app.use('/api', require('./controllers'))

module.exports = app