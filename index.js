const express = require('express')
const session = require('express-session')
const path = require('path')
const createError = require('http-errors')
const logger = require('morgan')

const app = express()
const PORT = 3000

const helloWorld = require('./routes/hello')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(logger('dev'))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: 'VerySecureKey',
  cookie: {
    maxAge: 6000
  }
}))

app.use('/hello', helloWorld)

app.use((req, res, next) => {
  next(createError(404))
})

app.use((err, req, res, next) => {
  // render the error page
  res.status(err.status || 500)
  res.render('error', { err: err, title: `${err.status} | ${err.message}` })
})

// Start server
app.listen(PORT, () => console.log(`Server running and listening on port ${PORT}!`))
