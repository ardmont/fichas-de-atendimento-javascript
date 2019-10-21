const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user.model')
const router = express.Router()

router
  .post('/', async (req, res) => {
    try {
      const user = await User.findOne({ login: req.body.login })
      // Verifica se usuário existe e se a senha é valida, e retorna uma mensagem de erro no caso contrário
      if (!user || (user && !bcrypt.compareSync(req.body.password, user.password))) res.json({ success: false, message: 'Usuário ou senha inválidos' })

      else {
        const { password, ...userInfo } = user._doc // Cria a variával userInfo, que será passada para o token, sem a senha do usuário.
        const token = jwt.sign(userInfo, process.env.SECRET)

        // Envia a resposta com o token
        res.json({
          success: true,
          message: 'Login realizado com sucesso',
          token: token,
          user: userInfo
        })
      }
    } catch (e) {
      throw new Error(e)
    }
  })

module.exports = router
