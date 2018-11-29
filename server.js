const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const fs = require('fs')
const axios = require('axios')
var date = new Date()

const BACK_HOST = process.env.BACK_HOST || "http://localhost:3000"
const UPDATE_EVENTS_API_TIMEOUT = +process.env.UPDATE_EVENTS_API_TIMEOUT || (5 * 60 * 1000) //5 Minutes

var information = []
const getInformation = () => {
  return axios.get(`${BACK_HOST}/data/information`)
  .then((response) => {
    information = response.data || []
  })
  .catch(() => {
    information = []
    console.log("Error, can't get information from webservice");
  })
}
getInformation()

setInterval(() => {
  getInformation()
    .then(information => {
      io.emit('updateEvents', information);
    })
}, 300000) // 5 minutes


var events = []
const getData = () => axios.get(`${BACK_HOST}/data/building`)
  .then((response) => {
    events = response.data
  })
  .catch(() => {
    events = []
    console.log("Error, can't get data from webservice");
  })

getData()

setInterval(() => {
  getData()
    .then(() => {
      io.emit('updateEvents', events);
    })
}, 1 * 60 * 60 * 1000) // 30 minutes

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('socket.io', express.static('node_modules/socket.io-client/dist'))

const svg = fs.readdirSync('svg').map(file => fs.readFileSync('svg/' + file))

app.get('/', function (req, res, next) {
  if (events.length === 0) {
    getInformation()
    return res.sendStatus(500)
  }

  return res.render('index', { svg, events, information})
})

http.listen(8080, () => console.log("Serveur launched at port 8080"))
