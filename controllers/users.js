const express = require('express')
let router = express.Router()

const Users = require('../models/Users')
let users = new Users()

router.post('/', async(req, res) => {
	const newUser = {
		email_user: req.body.email_user,
		password_user: req.body.password_user,
		first_name_user: req.body.first_name_user,
		last_name_user: req.body.last_name_user
	}
	const registeredUser = await users.register(newUser)

	res.send(registeredUser)
})

router.post('/login', async(req, res) => {
	const email_user = req.body.email_user
	const password_user = req.body.password_user

	const userLogged = await users.login(email_user, password_user)

	res.send(userLogged)
})

router.put('/:id_user/logout', Users.requireLogin, async(req, res) => {
	const idUser = req.params.id_user
	const userLoggedOut = await users.logout(idUser)

	res.send(userLoggedOut)
})

router.get('/:id_user/info', Users.requireLogin, async(req, res) => {
	const idUser = req.params.id_user
	const userProfile = await users.getProfile(idUser)

	res.send(userProfile)
})

module.exports = router