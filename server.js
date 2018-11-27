const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const fs = require('fs')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('socket.io', express.static('node_modules/socket.io-client/dist'))

const svg = fs.readdirSync('svg').map(file => fs.readFileSync('svg/'+file))

app.get('/', function(req, res, next){
  res.render('index', {svg})
})

io.on('connection', function(socket){
//  console.log('a user connected')
})

http.listen(8080, () => console.log("Serveur launched at port 8080"))
