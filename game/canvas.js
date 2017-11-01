var CanvasRenderer = function(targetSelector) {

  var renderer = this
  renderer.canvas = document.querySelector(targetSelector) || document.getElementsByTagName("canvas")[0]
  renderer.width = renderer.canvas.width
  renderer.height = renderer.canvas.height

  renderer.debugOffset = 10
  renderer.camera = {}

  if(!renderer.canvas) {
    console.error("No canvas rendering target found.")
    return
  }

  renderer.ctx = renderer.canvas.getContext("2d")

  renderer.render = function(game) {
    renderer.camera = game.camera
    renderer.ctx.translate(renderer.camera.x() + renderer.width/2, renderer.camera.y() + renderer.height/2)
    game.renderOrder.forEach(function(layerId) {
      game.renderLayers[layerId].forEach(function(sprite) {

        if(sprite.tiled) {
          renderer.drawTiledSprite(sprite.image, sprite.x, sprite.y, sprite.offsetRatio)
        }
        else {
          renderer.drawSprite(sprite.image, (sprite.body)? sprite.body.x:sprite.x, (sprite.body)?sprite.body.y:sprite.y, (sprite.body)?sprite.body.rotation:sprite.rotation, sprite.scale, sprite.frame)
        }
      })
    })
    renderer.ctx.translate(-renderer.camera.x() - renderer.width/2, -renderer.camera.y() - renderer.height/2)

  }

  renderer.drawSprite = function(img,x,y,rotation,scale,frame) {
    if(!scale) scale = 1
    if(!rotation) rotation = 0
    var width = frame.width*scale
    var height = frame.height*scale
    renderer.ctx.translate(x , y )
    renderer.ctx.rotate(rotation*Math.PI/180)
    renderer.ctx.drawImage(img, frame.x, frame.y, frame.width, frame.height, -width/2, -width/2, width, height )
    renderer.ctx.rotate(-rotation*Math.PI/180)
    renderer.ctx.translate(-x , -y )
  }

  renderer.debugText = function(str) {
    renderer.ctx.font = '12px Arial'
    renderer.ctx.fillStyle = '#00FF00'
    renderer.ctx.fillText(str, 0, renderer.debugOffset)
    renderer.debugOffset += 14
  }

  renderer.drawTiledSprite = function(img,x,y,ratio) {
    var ratio = ratio || 1
    renderer.ctx.translate(x, y)
    var pattern = renderer.ctx.createPattern(img, 'repeat')
    renderer.ctx.fillStyle = pattern
    renderer.ctx.fillRect( -renderer.width/2 - renderer.camera.x(), -renderer.height/2 - renderer.camera.y(), renderer.width, renderer.height)
    renderer.ctx.translate(-x, -y)
  }

  renderer.clear = function() {
    renderer.ctx.clearRect(0,0,renderer.width,renderer.height);
    renderer.debugOffset = 10
  }

  renderer.resize = function() {
    renderer.width = window.innerWidth
    renderer.height = window.innerHeight
    renderer.canvas.width = window.innerWidth
    renderer.canvas.height = window.innerHeight
    if(renderer.canvas.webkitRequestFullScreen) {
      renderer.canvas.webkitRequestFullScreen();
    }
    else {
      renderer.canvas.mozRequestFullScreen();
    }
  }
}
