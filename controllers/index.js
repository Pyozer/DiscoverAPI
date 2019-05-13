const express = require('express')
let router = express.Router()

router.get('/', (req, res) => res.json({ message: 'API Discover' }))

router.use('/tags', require('./tags'))
router.use('/posts', require('./posts'))
router.use('/users', require('./users'))

module.exports = router