var PlayScreen = function(game) {

  this.Server = {};
  var state = this;

  state.loaded = false;
  state.ship = null
  state.messageId = 0
  state.nextAcc = 0
  state.nextAngAcc = 0
  state.playerInfo = {}

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
    // this.Server.socket = io.connect("http://d2f6ad84.ngrok.io");
    //game.Client.socket = io.connect("http://bf863ee2.ngrok.io");

    this.Server.join = function(){
      this.socket.emit('playerConnected');
    };

    this.Server.fire = function() {
      this.socket.emit('fire', state.messageId++)
    }

    this.Server.reverse = function() {
      this.socket.emit('reverse', state.messageId++)
    }

    this.Server.thrust = function() {
      this.socket.emit('thrust', state.messageId++)
    }

    this.Server.rotateRight = function() {
      this.socket.emit('rotateRight', state.messageId++)
    }

    this.Server.rotateLeft = function() {
      this.socket.emit('rotateLeft', state.messageId++)
    }

    this.Server.socket.on('fire', function(data) {
      var bullet = game.addSprite(null, "projectiles", {image: game.images.bullet})
      game.enablePhysicsOn(bullet.key, data)
    })

    this.Server.socket.on('removeProjectile', function() {
      game.destroySprite()
    })

    this.Server.socket.on("accelerateBody", function(id, amount) {
      game.getSprite(id+"ship", "stage").body.thrust(amount)
    })

    this.Server.socket.on("rotateBody", function(id, amount) {
      game.getSprite(id+"ship", "stage").body.rotateRight(amount)
    })

    this.Server.socket.on('playerConnected',function(player){
      gameData.players[player.id] = player
      var p = game.addSprite(player.id+"ship", "stage", {scale: .15, image: game.images.ship, frameMap: shipFrames, com: player.ship.com})
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
      // console.log("universe", data);
      // Object.keys(data.data.players).forEach(function(p) {
      //   var id = data.players[p].id
      //   if(id != state.playerId) {
      //     var ship = data.players[p].ship
      //     var player = game.addSprite(id+"ship", "stage", {scale: .15, image: game.images.ship, frameMap: shipFrames})
      //     player.setFrame("default")
      //     game.enablePhysicsOn(id+"ship", ship)
      //   }
      // })
      // gameData = data;
    });

    this.Server.socket.on('welcome',function(data){
      console.log("Player Info:", data);
      state.ship = game.addSprite("ship", "stage", {scale: .15, frameMap: shipFrames, com: data.ship.com})
      state.weapon = data.ship.weapon
      state.playerId = data.id
      state.playerInfo = data

      game.enablePhysicsOn("ship", data.ship.body)

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

    console.log("waiting to join server...")
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
      console.log("waiting for welcome message...")
      return
    }

    if(game.keyboard.keys.up) {
      state.ship.setFrame('accelerating')
      if(time > state.nextAcc) {
        state.ship.body.thrust(state.playerInfo.ship.enginePower)
        this.Server.thrust()
        state.nextAcc = time + 1000/30
      }
    }
    else if(game.keyboard.keys.down) {
      if(time > state.nextAcc) {
        state.ship.body.reverse(state.playerInfo.ship.enginePower)
        this.Server.reverse()
        state.nextAcc = time + 1000/30
      }
    }
    else {
      state.ship.setFrame('default')
    }

    if(game.keyboard.keys.right) {
      if(time > state.nextAngAcc) {
        state.ship.body.rotateRight(state.playerInfo.ship.handling)
        this.Server.rotateRight()
        state.nextAngAcc = time + 1000/30
      }
    }
    else if(game.keyboard.keys.left) {
      if(time > state.nextAngAcc) {
        state.ship.body.rotateLeft(state.playerInfo.ship.handling)
        this.Server.rotateLeft()
        state.nextAngAcc = time + 1000/30
      }
    }
    else {
      // state.ship.body.angularVelocity *=.7
    }

    if(game.keyboard.keys.space) {
      if (time > state.weapon.nextFireTime)
      {
        state.weapon.nextFireTime = time + state.weapon.fireRate;

        var bullet = game.addSprite(null, "projectiles", {image: game.images.bullet})
        var x = state.ship.body.x + Math.sin(state.ship.body.rotation*Math.PI/180)*100
        var y = state.ship.body.y - Math.cos(state.ship.body.rotation*Math.PI/180)*100
        var vx = state.ship.body.velocity.x + Math.sin(state.ship.body.rotation*Math.PI/180)*1000
        var vy = state.ship.body.velocity.y - Math.cos(state.ship.body.rotation*Math.PI/180)*1000
        var definition = {lifespan: 3000, x: x, y: y, rotation: state.ship.body.rotation, frictionless: true, vx: vx, vy: vy}
        game.enablePhysicsOn(bullet.key, definition)
        this.Server.fire()
        //bullet.body.thrust(50000)
      }
    }

  }

  return this

}
