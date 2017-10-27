var PlayScreen = function(game) {

  this.Server = {};
  var state = this;

  state.loaded = false;
  state.ship = null

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
    // this.Server.socket = io.connect("http://localhost:8081");
    this.Server.socket = io.connect("http://d2f6ad84.ngrok.io");
    //game.Client.socket = io.connect("http://bf863ee2.ngrok.io");

    this.Server.join = function(){
      this.socket.emit('playerConnected');
    };

    this.Server.createProjectile = function(data) {
      this.socket.emit('createProjectile', data)
    }

    this.Server.accelerateShip = function(amount) {
      this.socket.emit('accelerateShip', amount)
    }

    this.Server.rotateShip = function(amount) {
      this.socket.emit('rotateShip', amount)
    }

    this.Server.socket.on('createProjectile', function(data) {
      var bullet = game.addSprite(null, "projectiles", {image: game.images.bullet})
      game.enablePhysicsOn(bullet.key, data)
    })

    this.Server.socket.on("accelerateBody", function(id, amount) {
      game.getSprite(id+"ship", "stage").body.thrust(amount)
    })

    this.Server.socket.on("rotateBody", function(id, amount) {
      game.getSprite(id+"ship", "stage").body.rotateRight(amount)
    })

    this.Server.socket.on('playerConnected',function(player){
      gameData.players[player.id] = player

      var p = game.addSprite(player.id+"ship", "stage", {scale: .15, image: game.images.ship, frameMap: shipFrames})
      p.setFrame("default")
      game.enablePhysicsOn(player.id+"ship", player.ship)

      console.log("new player connected: ", player)
    });

    this.Server.socket.on('playerDisconnected',function(id){
      game.destroySprite(id+"ship", "stage")
      delete gameData.players[id]
      console.log("player disconnected: ", id)
    });

    this.Server.socket.on('universe',function(data){
      console.log("Universe", data);
      Object.keys(data.players).forEach(function(p) {
        var id = data.players[p].id
        if(id != state.playerId) {
          var ship = data.players[p].ship
          var player = game.addSprite(id+"ship", "stage", {scale: .15, image: game.images.ship, frameMap: shipFrames})
          player.setFrame("default")
          game.enablePhysicsOn(id+"ship", ship)
        }
      })
      gameData = data;
    });

    this.Server.socket.on('welcome',function(data){
      console.log("Player Info:", data);
      state.ship = game.addSprite("ship", "stage", {scale: .15, frameMap: shipFrames})
      state.ship.nextFire = -1
      state.ship.fireRate = 100
      state.playerId = data.id

      game.enablePhysicsOn("ship", data.ship)

      game.camera.track(state.ship)
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
    //this.bg2 = game.addSprite("bg2", "background", {image: game.images.bg2, tiled: true, offsetRatio: 2})
    // this.ship = game.addSprite("ship", "stage", {scale: .2, x: 0, y: 0})
    // this.ship.nextFire = -1
    // this.ship.fireRate = 300
    //
    // game.enablePhysicsOn("ship")
    //
    // game.camera.track(this.ship)
    // this.loaded = true
    console.log("waiting for server...")
  }

  this.render = function() {
    if ( !state.loaded ) return
    game.renderer.debugText("Speed: " + parseInt(game.sprites.ship.body.velocity.magnitude()))
    game.renderer.debugText("Sector: " + parseInt(game.sprites.ship.body.x / 100) + ", " + parseInt(game.sprites.ship.body.y / 100))
  }

  this.update = function( time ) {

    this.alphaStation.rotation += .03
    this.alphaStationProbes.rotation -= .03

    if ( !state.loaded ) {
      console.log("witing to hoin")
      return
    }

    if(game.keyboard.keys.up) {
      state.ship.setFrame('accelerating')
      state.ship.body.thrust(400)
      this.Server.accelerateShip(400)

    }
    else if(game.keyboard.keys.down) {
      state.ship.body.reverse(400)
      this.Server.accelerateShip(-400)
    }
    else {
      state.ship.setFrame('default')
    }

    if(game.keyboard.keys.right) {
      state.ship.body.rotateRight(150)
      this.Server.rotateShip(150)
    }
    else if(game.keyboard.keys.left) {
      state.ship.body.rotateLeft(150)
      this.Server.rotateShip(-150)
    }
    else {
      // state.ship.body.angularVelocity *=.7
    }

    if(game.keyboard.keys.space) {
      if (time > state.ship.nextFire)
      {
        state.ship.nextFire = time + state.ship.fireRate;

        var bullet = game.addSprite(null, "projectiles", {image: game.images.bullet})
        var x = state.ship.body.x + Math.sin(state.ship.body.rotation*Math.PI/180)*100
        var y = state.ship.body.y - Math.cos(state.ship.body.rotation*Math.PI/180)*100
        var vx = state.ship.body.velocity.x + Math.sin(state.ship.body.rotation*Math.PI/180)*1000
        var vy = state.ship.body.velocity.y - Math.cos(state.ship.body.rotation*Math.PI/180)*1000
        var definition = {lifespan: 3000, x: x, y: y, rotation: state.ship.body.rotation, frictionless: true, vx: vx, vy: vy}
        game.enablePhysicsOn(bullet.key, definition)
        this.Server.createProjectile(definition)
        //bullet.body.thrust(50000)
      }
    }

  }

  return this

}
