var PlayScreen = function(game) {

  var state = this;

  state.playerInfo = {
    enginePower: 400,
    handling: 150,
    nextFireTime: 0,
    fireRate: 300
  }

  var gameData = {
    name: "",
    players: {},
    asteroids: [],
    stations: [],
  };

  var shipFrames = {
    default: {x: 0, y: 0, width: 720, height: 713},
    accelerating: {x: 720, y: 0, width: 720, height: 713},
    decelerating: {x: 1440, y: 0, width: 720, height: 713}
  }

  this.create = function() {

    this.server = new Server()
    this.server.join()

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

    this.ship = game.addSprite("ship", "stage", {scale: .15, frameMap: shipFrames})
    this.ship.setFrame("default")
    game.enablePhysicsOn("ship")

    game.camera.track(this.ship)

    game.addSound("audio/laser.mp3", "laserPulse")
    game.addSound("audio/bg.wav", "bg", {loop: true})
    game.addSound("audio/engine.mp3", "engine", {loop: true})
    game.sounds.laserPulse.setVolume(.1)
    game.sounds.engine.setVolume(0)
    game.sounds.engine.play()
    game.sounds.bg.setVolume(.05)
    game.sounds.bg.play()

  }

  this.render = function() {
    game.renderer.debugText("Speed: " + parseInt(game.sprites.ship.body.velocity.magnitude()))
    game.renderer.debugText("Sector: " + parseInt(game.sprites.ship.body.x / 100) + ", " + parseInt(game.sprites.ship.body.y / 100))
  }

  this.update = function( time ) {

    this.alphaStation.rotation += .03
    this.alphaStationProbes.rotation -= .03

    if(game.keyboard.keys.up) {
      state.ship.setFrame('accelerating')
      state.ship.body.thrust(state.playerInfo.enginePower)
      game.sounds.engine.volumeUp(.1, .8)
    }
    else if(game.keyboard.keys.down) {
      state.ship.setFrame('decelerating')
      state.ship.body.reverse(state.playerInfo.enginePower)
      game.sounds.engine.volumeUp(.1, .8)
    }
    else {
      state.ship.setFrame('default')
      game.sounds.engine.volumeDown(.1, 0)
    }

    if(game.keyboard.keys.right) {
      state.ship.body.rotateRight(state.playerInfo.handling)
    }
    else if(game.keyboard.keys.left) {
      state.ship.body.rotateLeft(state.playerInfo.handling)
    }
    else {
      state.ship.body.angularVelocity *=.7
    }

    if(game.keyboard.keys.space) {
      if (time > state.playerInfo.nextFireTime)
      {
        state.playerInfo.nextFireTime = time + state.playerInfo.fireRate;

        var bullet = game.addSprite(null, "projectiles", {image: game.images.bullet})
        var x = state.ship.body.x + Math.sin(state.ship.body.rotation*Math.PI/180)*100
        var y = state.ship.body.y - Math.cos(state.ship.body.rotation*Math.PI/180)*100
        var vx = state.ship.body.velocity.x + Math.sin(state.ship.body.rotation*Math.PI/180)*1000
        var vy = state.ship.body.velocity.y - Math.cos(state.ship.body.rotation*Math.PI/180)*1000
        var definition = {lifespan: 3000, x: x, y: y, rotation: state.ship.body.rotation, frictionless: true, vx: vx, vy: vy}
        game.enablePhysicsOn(bullet.key, definition)
        game.sounds.laserPulse.stop()
        game.sounds.laserPulse.play()
        // this.Server.fire()
        //bullet.body.thrust(50000)
      }
    }

  }

  return this

}
