const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const fs = require('fs')
const axios = require('axios')
var date = new Date()
var str = " à "
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var dateUpdate = date.toLocaleDateString('fr-FR', options).concat(str, date.toLocaleTimeString())

const BACK_HOST = "http://localhost:3000"

var information = []
const getInformation = () => axios.get(`${BACK_HOST}/data/information`)
  .then((response) => {
    information = response.data
  })
  .catch(() => {
    information = []
    console.log("Error, can't get information from webservice");
  })

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
    .then(events => {
      io.emit('updateEvents', events);
    })
}, 1 * 60 * 60 * 1000) // 30 minutes

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('socket.io', express.static('node_modules/socket.io-client/dist'))

const svg = fs.readdirSync('svg').map(file => fs.readFileSync('svg/' + file))

app.get('/', function (req, res, next) {
  if (events.length === 0) {
    return res.sendStatus(500)
  }

  return res.render('index', { svg, events, information , dateUpdate})
})

io.on('updateEvents', function (socket) {
  //  console.log('a user connected')
})

http.listen(8080, () => console.log("Serveur launched at port 8080"))
