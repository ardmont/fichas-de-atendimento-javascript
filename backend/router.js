const express = require('express')

//const routes = require('./routes')

const router = express.Router()

//router.use('/login', routes.login)
//router.use('/expedient', routes.expedient)
router.use('/', (req, res) => {
  res.send('on router')
})

module.exports = router
