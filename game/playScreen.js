var PlayScreen = function(game) {

  this.Server = {};
  var gameData = {
    name: "",
    players: {},
    asteroids: [],
    stations: []
  };

  this.setupServerSocket = function() {
    this.Server.socket = io.connect("http://localhost:8081");
    //game.Client.socket = io.connect("http://bf863ee2.ngrok.io");

    this.Server.join = function(){
      this.socket.emit('playerConnected');
    };

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
  }

  this.lastUpdateTime = -1
  this.rotation = -45
  this.x = 300
  this.y = 900
  this.loaded = false

  this.create = function() {
    console.log("creating play")
    this.setupServerSocket()
    this.Server.join()

    game.addRenderLayer("background")
    game.addRenderLayer("stage")
    game.addRenderLayer("projectiles")
    game.renderOrder = ["background", "stage", "projectiles"]

    this.bg = game.addSprite("bg", "background", {tiled: true})
    this.bg2 = game.addSprite("bg2", "background", {image: game.images.bg2, tiled: true, offsetRatio: 2})
    this.ship = game.addSprite("ship", "stage", {scale: .2, x: 0, y: 0})
    this.ship.nextFire = -1
    this.ship.fireRate = 100

    game.enablePhysicsOn("ship")

    game.camera.track(this.ship)
    this.loaded = true
  }

  this.render = function() {
    if ( !this.loaded ) return
    game.renderer.debugText("Speed: " + parseInt(game.sprites.ship.body.velocity.magnitude()))
    game.renderer.debugText("Sector: " + parseInt(game.sprites.ship.body.x / 100) + ", " + parseInt(game.sprites.ship.body.y / 100))
  }

  this.update = function( time ) {
    if ( !this.loaded ) return

    if(game.keyboard.keys.up) {
      this.ship.body.thrust(400)
    }
    else if(game.keyboard.keys.down) {
      this.ship.body.reverse(400)
    }

    if(game.keyboard.keys.right) {
      this.ship.body.rotateRight(150)
    }
    else if(game.keyboard.keys.left) {
      this.ship.body.rotateLeft(150)
    }
    else {
      this.ship.body.angularVelocity *=.7
    }

    if(game.keyboard.keys.space) {
      if (time > this.ship.nextFire)
      {
        console.log(gameData)
        this.ship.nextFire = time + this.ship.fireRate;

        var bullet = game.addSprite(null, "projectiles", {image: game.images.bullet})
        var x = this.ship.body.x + Math.sin(this.ship.body.rotation*Math.PI/180)*100
        var y = this.ship.body.y - Math.cos(this.ship.body.rotation*Math.PI/180)*100
        game.enablePhysicsOn(bullet.key, {lifespan: 3000, x: x, y: y, rotation: this.ship.body.rotation, frictionless: true})
        bullet.body.thrust(50000)
      }
    }

  }

  return this

}
