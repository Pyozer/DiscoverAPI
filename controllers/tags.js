const express = require('express')
let router = express.Router()

const Tags = require('../models/Tags')
let tags = new Tags()

router.get('/', async (req, res) => {
	const tagsResult = await tags.findAll()
	res.status(200).send(tagsResult)
})

module.exports = router