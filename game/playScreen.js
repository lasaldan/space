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

  this.setupServerSocket = function() {
    this.Server.socket = io.connect("http://localhost:8081");
    //game.Client.socket = io.connect("http://bf863ee2.ngrok.io");

    this.Server.join = function(){
      this.socket.emit('playerConnected');
    };

    this.Server.createProjectile = function(data) {
      this.socket.emit('createProjectile', data)
    }

    this.Server.socket.on('createProjectile', function(data) {
      var bullet = game.addSprite(null, "projectiles", {image: game.images.bullet})
      game.enablePhysicsOn(bullet.key, data)
    })

    this.Server.socket.on('playerConnected',function(player){
      gameData.players[player.id] = player
      console.log("new player connected: ", player)
    });

    this.Server.socket.on('playerDisconnected',function(id){
      delete gameData.players[id]
      console.log("player disconnected: ", id)
    });

    this.Server.socket.on('universe',function(data){
      console.log("Universe", data);
      gameData = data;
    });

    this.Server.socket.on('welcome',function(data){
      console.log("Player Info:", data);
      state.ship = game.addSprite("ship", "stage", {scale: .2, x: 0, y: 0})
      state.ship.nextFire = -1
      state.ship.fireRate = 300

      game.enablePhysicsOn("ship")

      game.camera.track(state.ship)
      console.log("Welcome")
      state.loaded = true
      console.log("set to loaded")
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
    if ( !state.loaded ) {
      console.log("witing to hoin")
      return
    }

    if(game.keyboard.keys.up) {
      state.ship.body.thrust(400)
    }
    else if(game.keyboard.keys.down) {
      state.ship.body.reverse(400)
    }

    if(game.keyboard.keys.right) {
      state.ship.body.rotateRight(150)
    }
    else if(game.keyboard.keys.left) {
      state.ship.body.rotateLeft(150)
    }
    else {
      state.ship.body.angularVelocity *=.7
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
