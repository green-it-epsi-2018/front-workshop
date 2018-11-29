const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const fs = require('fs')
const axios = require('axios')

const BACK_HOST = "http://localhost:3000"

var date = new Date(2018, 11, 28, 8, 00, 00, 00);
var objct = [{ 
  "DateDebut": new Date(2018, 10, 28, 10, 00, 00).getTime(),
  "DateFin": new Date(2018, 10, 28, 12, 00, 00).getTime(),
  "Promo": "I5",
  "Intervenant": "Bernard",
  "Matiere": "pilotage de  projet",
  "NumeroSalle": 200,
  "NumeroEtage": 2
},
{
  "DateDebut": new Date(2018, 10, 28, 08, 00, 00).getTime(),
"DateFin": new Date(2018, 11, 28, 10, 00, 00).getTime(),
"Promo": "I4",
"Intervenant": "Khaled",
"Matiere": "Réseaux",
"NumeroSalle": 214,
"NumeroEtage": 2
},
{
  "DateDebut": new Date(2018, 11, 28, 10, 00, 00).getTime(),
  "DateFin": new Date(2018, 11, 28, 12, 00, 00).getTime(),
  "Promo": "I4",
  "Intervenant": "Hugo",
  "Matiere": "IA",
  "NumeroSalle": 214,
  "NumeroEtage": 2
  },
  {
    "DateDebut": new Date(2018, 11, 28, 14, 00, 00).getTime(),
    "DateFin": new Date(2018, 11, 28, 17, 00, 00).getTime(),
    "Promo": "I4",
    "Intervenant": "Alexendre",
    "Matiere": "Big Data",
    "NumeroSalle": 100,
    "NumeroEtage": 1
  },
  {
    "DateDebut": new Date(2018, 11, 28, 8, 00, 00).getTime(),
    "DateFin": new Date(2018, 11, 28, 10, 00, 00).getTime(),
    "Promo": "I4",
    "Intervenant": "Prof Anglais",
    "Matiere": "Anglais",
    "NumeroSalle": 101,
    "NumeroEtage": 1
  },
  {
    "DateDebut": new Date(2018, 10, 28, 8, 00, 00).getTime(),
    "DateFin": new Date(2018, 10, 28, 12, 00, 00).getTime(),
    "Promo": "I4",
    "Intervenant": "Prof Anglais",
    "Matiere": "Anglais",
    "NumeroSalle": 300,
    "NumeroEtage": 3
  },
  {
    "DateDebut": new Date(2018, 10, 28, 8, 00, 00).getTime(),
    "DateFin": new Date(2018, 10, 28, 12, 00, 00).getTime(),
    "Promo": "I4",
    "Intervenant": "Prof Anglais",
    "Matiere": "Anglais",
    "NumeroSalle": 300,
    "NumeroEtage": 3
  }]

var events = []
const getData = () => axios.get(`${BACK_HOST}/data/building`)
  .then((response) =>{
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

const svg = fs.readdirSync('svg').map(file => fs.readFileSync('svg/'+file))

app.get('/', function(req, res, next){
  if(events.length === 0){
    return res.sendStatus(500)
  }

  return res.render('index', {svg, events})
})

io.on('updateEvents', function(socket){
//  console.log('a user connected')
})

http.listen(8080, () => console.log("Serveur launched at port 8080"))
