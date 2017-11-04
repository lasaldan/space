var LoadingScreen = function(game) {

  // this.render = function() {
  //   console.log("rendering")
  // }

  this.create = function() {
    console.log("creating loading")
    game.addImage("ship", "../client/www/assets/ship_frames.png")
    game.addImage("bg", "../client/www/assets/bg1.jpg")
    game.addImage("bg2", "../client/www/assets/bg2.png")
    game.addImage("bullet", "../client/www/assets/projectile1.png")
    game.addImage("station", "../client/www/assets/spacestation.png")
    game.addImage("stationProbes", "../client/www/assets/spacestationProbes.png")
    game.addImage("nebula1", "../client/www/assets/nebula1.png")
    game.addImage("nebula2", "../client/www/assets/nebula2.png")
    game.addImage("nebula3", "../client/www/assets/nebula3.png")
    game.addImage("nebula4", "../client/www/assets/nebula4.png")
  }

  this.update = function() {
    console.log("updating loading")
    if(game.loaded)
      game.startState("title")
  }

  return this

}
