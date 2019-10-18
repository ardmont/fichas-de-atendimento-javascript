const express = require('express')

const routes = require('./routes')

const router = express.Router()

router.use('/login', routes.login)

module.exports = router
