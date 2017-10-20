var Game = function() {

  var game = this

  game.states = {}
  game.images = {}
  game.requestedImageCount = 0;
  game.loaded = true;
  game.currentState = null;
  game.stepping = false;


  // renderer must have the following methods
  // drawSprite(img,x,y,rotation,scale)
  // drawBackground(x,y,img)
  game.setRenderer = function(renderer, target) {
    game.renderer = new renderer(target)
  }


  // Add states with the following possible methods:
  // render
  // update
  // create
  game.addState = function(name, state) {
    game.states[name] = state
  }


  // Step forward with the current state's methods
  game.step = function( time ) {
    requestAnimationFrame(game.step)

    if(game.loaded) {

      if(game.renderer)
        game.renderer.clear()

      if(typeof game.currentState.update === "function")
        game.currentState.update(time)

      if(game.renderer && typeof game.currentState.render === "function")
        game.currentState.render()

    }

  }


  // Add an image to the game available at game.images.KEY
  game.addImage = function(key, url) {
    game.requestedImageCount ++;
    game.loaded = false;
    console.log("requesting " + url)

    var img = new Image();

    img.onload = function() {
      game.images[key] = img
      console.log("recieved " + url)
      if(game.requestedImageCount == Object.keys(game.images).length)
        game.loaded = true
    }

    img.src = url
  }


  // Start the provided state of the game.
  game.startState = function(stateName) {
    var state = game.states[stateName]

    if(!state) {
      console.error("No initial state provided.")
      return
    }

    game.currentState = new state(game)

    if(typeof game.currentState.create === "function")
      game.currentState.create()

    game.stepping = true
    game.step()
  }
}
