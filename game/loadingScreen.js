var LoadingScreen = function(game) {

  // this.render = function() {
  //   console.log("rendering")
  // }

  this.create = function() {
    console.log("creating loading")
    game.startState("title")
  }

  this.update = function() {
    console.log("updating loading")
  }

  return this

}
