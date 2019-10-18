require('dotenv').config()
const http = require('http')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const router = require('./backend/router')
const environment = process.env.NODE_ENV || 'production'

let dbUrl

// Sets the mongodb connection URL according to the defined environment
switch (environment) {
  case 'development':
    dbUrl = process.env.DB_DEV_URL
    break
  case 'test':
    dbUrl = process.env.DB_TEST_URL
    break
  default:
    dbUrl = process.env.DB_PROD_URL
    break
}

// Initiates express application
const app = express()
const port = process.env.PORT || 3000

app.use(cors()) // Enable cors
app.use(express.json()) // Parses all json data sent to the REST endpoints
app.use('/api', router) // Listen to the public REST endpoints

// Creates http server with express app
const httpServer = http.createServer(app)

// Creates socket.io server
const io = require('socket.io')(httpServer)
io.on('connection', function (socket) {
  console.log('a client is connected')
  socket.on('disconnect', function () {
    console.log('client is disconnected')
  })
})

app.get('/', (req, res) => {
  res.send('hello world')
})

// Connects to mongodb and starts express app
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(httpServer.listen(port, () => {
    console.log(`app listening on port ${port}. Environment: ${environment}`)
    // console.log(`🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`)
  }))
  .catch((err) => { console.log(err) })
