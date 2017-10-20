var TitleScreen = function(game) {

  this.lastUpdateTime = -1
  this.rotation = 0

  this.create = function() {
    console.log("creating title")
    game.addImage("ship", "../client/www/assets/ship.png")
    game.addImage("bg", "../client/www/assets/bg1.jpg")
  }

  this.render = function() {
    game.renderer.drawBackground(game.images.bg,0,0)
    game.renderer.drawSprite(game.images.ship,0,0,this.rotation)
  }

  this.update = function( time ) {
    if(time != this.lastUpdateTime) {
      //console.log(1000 / (time - this.lastUpdateTime))
      this.lastUpdateTime = time
      this.rotation -= .1
    }
  }

  return this

}
