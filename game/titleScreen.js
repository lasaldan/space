var TitleScreen = function(game) {

  this.lastUpdateTime = -1
  this.rotation = -45
  this.x = 300
  this.y = 900

  this.create = function() {
    console.log("creating title")

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
  }

  this.render = function() {
    // game.renderer.drawBackground(game.images.bg,0,0)
    // game.renderer.drawSprite(game.images.ship,this.x,this.y,this.rotation,.1)
  }

  this.update = function( time ) {
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
