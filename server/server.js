var express = require('express');
var phaser = require('phaser')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
});

function Game() {
  return {
    name: "Serenity",
    players: {},
    asteroids: [],
    stations: [],
    size: 5000,
    background: "bg1.jpg"
  }
}

var sim = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.HEADLESS);
server.game = new Game()

server.log = function(msg) {
  var timestamp = new Date()
  console.log(timestamp.toDateString() + " " + timestamp.toTimeString() + "   " + msg)
}

io.on('connection',function(socket){
  socket.on('newplayer',function(){

    socket.player = {
      id: socket.id,
      name: "pilot" + randomInt(0,10)
    };

    server.game.players[socket.id] = socket.player
    socket.emit('universe',getUniverse());
    socket.broadcast.emit('newplayer',socket.player);

    server.log("Player Joined: "+socket.id)

    socket.on('disconnect',function(){
      delete server.game.players[socket.id]
      io.emit('remove',socket.id);
      server.log("Player Disconnected: "+socket.id)
    });
  });
});

function getUniverse() {
  return server.game
}

function getAllPlayers(){
  return server.game.players
  // var players = [];
  // Object.keys(io.sockets.connected).forEach(function(socketID){
  //   var player = io.sockets.connected[socketID].player;
  //   if(player) players.push(player);
  // });
  // return players;
}

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

server.listen(8081,function(){ // Listens to port 8081
  server.log('Listening on '+server.address().port);
});
