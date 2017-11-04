var PlayScreen = function(game) {

  this.Server = {};
  var state = this;

  state.loaded = false;
  state.ship = null
  state.messageId = 0

  var gameData = {
    name: "",
    players: {},
    asteroids: [],
    stations: [],
  };

  var shipFrames = {
    default: {x: 0, y: 0, width: 720, height: 713},
    accelerating: {x: 720, y: 0, width: 720, height: 713}
  }

  this.setupServerSocket = function() {
    this.Server.socket = io.connect("http://localhost:8081");

    this.Server.join = function(){
      this.socket.emit('playerConnected');
    };

    // this.Server.socket.on('fire', function(data) {
    //   var bullet = game.addSprite(null, "projectiles", {image: game.images.bullet})
    //   game.enablePhysicsOn(bullet.key, data)
    // })
    //
    // this.Server.socket.on('removeProjectile', function() {
    //   game.destroySprite()
    // })
    //
    // this.Server.socket.on("accelerateBody", function(id, amount) {
    //   game.getSprite(id+"ship", "stage").body.thrust(amount)
    // })
    //
    // this.Server.socket.on("rotateBody", function(id, amount) {
    //   game.getSprite(id+"ship", "stage").body.rotateRight(amount)
    // })

    // this.Server.socket.on('playerConnected',function(player){
    //   gameData.players[player.id] = player
    //   var p = game.addSprite(player.id+"ship", "stage", {scale: .15, image: game.images.ship, frameMap: shipFrames, com: player.ship.com})
    //   p.setFrame("default")
    //   game.enablePhysicsOn(player.id+"ship", player.ship)
    //
    //   console.log("new player connected: ", player)
    // });

    // this.Server.socket.on('playerDisconnected',function(id){
    //   game.destroySprite(id+"ship", "stage")
    //   delete gameData.players[id]
    //   console.log("player disconnected: ", id)
    // });

    this.Server.socket.on('universe',function(data){
      console.log("universe", data);
      Object.keys(data.data.players).forEach(function(p) {
        var player = data.data.players[p]
        var id = data.data.players[p].id
        if(gameData.players[id]) {
          var ship = game.getSprite(id+"ship", "stage")
          ship.body.x = player.ship.body.x
          ship.body.y = player.ship.body.y
          ship.body.rotation = player.ship.body.rotation
        }
        else {
          var ship = data.data.players[p].ship
          var sprite = game.addSprite(id+"ship", "stage", {scale: .15, image: game.images.ship, frameMap: shipFrames})
          sprite.setFrame("default")
          game.enablePhysicsOn(id+"ship", ship)
          gameData.players[id] = true
        }
      })

      // var p = game.addSprite(data.data.players.id+"ship", "stage", {scale: .15, image: game.images.ship, frameMap: shipFrames, com: player.ship.com})
      //data.players[data.data.player.id]
      //gameData = data;
    });

    this.Server.socket.on('welcome',function(data){
      // console.log("Player Info:", data);
      // state.ship = game.addSprite("ship", "stage", {scale: .15, frameMap: shipFrames, com: data.ship.com})
      // state.weapon = data.ship.weapon
      // state.playerId = data.id
      //
      // game.enablePhysicsOn("ship", data.ship.body)
      //
      // game.camera.track(state.ship)
      console.log("Welcome")
      state.loaded = true
    });
  }

  // this.lastUpdateTime = -1
  // this.rotation = -45
  // this.x = 300
  // this.y = 900

  this.create = function() {
    console.log("creating play")
    this.setupServerSocket()
    this.Server.join()

    game.addRenderLayer("background")
    game.addRenderLayer("stage")
    game.addRenderLayer("projectiles")
    game.renderOrder = ["background", "stage", "projectiles"]

    this.bg = game.addSprite("bg", "background", {tiled: true})
    this.nebula1 = game.addSprite("nebula1", "background", {x: 1000, y: 1000})
    this.nebula2 = game.addSprite("nebula2", "background", {x: -1000, y: 1000})
    this.nebula3 = game.addSprite("nebula3", "background", {x: 1000, y: -1000})
    this.nebula4 = game.addSprite("nebula4", "background", {x: -1000, y: -1000})
    this.alphaStation = game.addSprite("station", "background", {x: 0, y: 0})
    this.alphaStationProbes = game.addSprite("stationProbes", "background", {x: 0, y: 0})

  }

  this.render = function() {
    // if ( !state.loaded ) return
    // game.renderer.debugText("Speed: " + parseInt(game.sprites.ship.body.velocity.magnitude()))
    // game.renderer.debugText("Sector: " + parseInt(game.sprites.ship.body.x / 100) + ", " + parseInt(game.sprites.ship.body.y / 100))
  }

  this.update = function( time ) {

  }

  return this

}
