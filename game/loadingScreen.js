var LoadingScreen = function(game) {

  // this.render = function() {
  //   console.log("rendering")
  // }

  this.create = function() {
    console.log("creating loading")
    game.addImage("ship", "../client/www/assets/ship.png")
    game.addImage("bg", "../client/www/assets/bg1.jpg")
    game.addImage("bg2", "../client/www/assets/bg2.png")
    game.addImage("bullet", "../client/www/assets/projectile1.png")
  }

  this.update = function() {
    console.log("updating loading")
    if(game.loaded)
      game.startState("title")
  }

  return this

}
