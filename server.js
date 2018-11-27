var express = require('express')
var app = express();
var http = require('http').Server(app)
var io = require('socket.io')(http);

app.use(express.static('public'))
app.use('socket.io', express.static('node_modules/socket.io-client/dist'))

app.get('/', function(req, res, next){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
//  console.log('a user connected');
});
http.listen(8080, () => console.log("Serveur launched at port 8080"));
