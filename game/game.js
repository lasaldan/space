
var Game = function(config) {

  var options = config || {}
  var game = this

  // game.mode = options.mode || "singleplayer"
  game.states = {}
  game.images = {}
  game.sprites = {}
  game.sounds = {}
  game.spriteID = 0
  game.collidableGroups = {}

  game.renderLayers = {}
  game.renderOrder = []

  game.requestedImageCount = 0;
  game.loaded = true;
  game.currentState = null;
  game.stepping = false;

  game.lastFrameTime = -1;
  game.debug = true

  game.camera = new Camera()
  game.keyboard = new Keyboard()

  game.setPhysicsEngine = function(engine) {
    game.physics = new engine()
  }

  game.enablePhysicsOn = function(spriteName, options) {
    game.sprites[spriteName].enablePhysics(game.physics, options)
  }

  // renderer must have the following methods
  // drawSprite(img,x,y,rotation,scale)
  // drawBackground(x,y,img)
  game.setRenderer = function(renderer, target) {
    game.renderer = new renderer(target)
    game.resize()
  }


  game.addRenderLayer = function(name) {
    game.renderLayers[name] = []
  }

  game.getSprite = function(key, layerName) {
    var sprite = {}
    game.renderLayers[layerName].forEach(function(s, i) {
      if(s.key == key)
        sprite = game.renderLayers[layerName][i]
    })
    return sprite
  }

  game.destroySprite = function(key, layerName) {
    if(!key) return
    game.physics.destroyBody(key)
    game.renderLayers[layerName].forEach(function(sprite, i) {
      if(sprite.key == key) {
        delete game.renderLayers[sprite.layerName][i]
      }
    })
  }

  game.addSprite = function(key, layerName, options) {
    if(!key) key = game.spriteID++
    var options = options || {}
    if(!options.image) options.image = game.images[key]
    options.key = key
    options.layerName = layerName
    var sprite = new Sprite(options)
    game.sprites[key] = sprite
    game.renderLayers[layerName].push(sprite)
    return sprite
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

    if(game.loaded && time - game.lastFrameTime) {

      if(typeof game.currentState.update === "function")
        game.currentState.update(time)

      if(game.physics)
        game.physics.stepSim(time)

      if(game.renderer) {
        game.renderer.clear()
        game.renderer.render(game)
      }

      if(game.renderer && typeof game.currentState.render === "function")
        game.currentState.render()

      if(game.debug) {
        var fps = 1000 / (time - game.lastFrameTime)
        game.renderer.debugText("FPS: " + parseInt(fps))
        game.lastFrameTime = time
      }

    }

  }


  game.resize = function() {
    if(game.renderer)
      game.renderer.resize()
  }


  // Add an image to the game available at game.images.KEY
  game.addImage = function(key, url) {
    game.requestedImageCount ++;
    game.loaded = false;

    var img = new Image();

    img.onload = function() {
      game.images[key] = img
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

  game.addSound = function(src, key, options) {
    game.sounds[key] = new Sound(src,options)
  }

  var Sprite = function(options) {
    var sprite = this
    sprite.layerName = options.layerName
    sprite.key = options.key
    sprite.image = options.image
    sprite.height = options.image.height
    sprite.width = options.image.width
    sprite.scale = options.scale || 1
    sprite.x = options.x || 0
    sprite.y = options.y || 0
    sprite.com = {x: 0, y: 0}
    sprite.rotation = options.image.rotation || 0
    sprite.frameCount = options.frameCount || 1
    sprite.tiled = options.tiled || false
    sprite.offsetRatio = options.offsetRatio || 0
    sprite.frameMap = options.frameMap || {}
    sprite.frame = {x:0, y:0, width: sprite.image.width, height: sprite.image.height}

    if( options.com ) {
      sprite.com.x = options.com.x || 0
      sprite.com.y = options.com.y || 0
    }

    sprite.enablePhysics = function(engine, options) {
      var options = options || {}

      options.onDelete = function() {
        delete game.renderLayers[sprite.layerName][sprite.key]
      }
      sprite.body = engine.createBody(options)
    }

    sprite.setFrame = function(key) {
      sprite.frame = sprite.frameMap[key]
    }
  }

}
