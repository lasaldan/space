var CanvasRenderer = function(targetSelector) {

  this.canvas = document.querySelector(targetSelector) || document.getElementsByTagName("canvas")[0]
  this.width = this.canvas.width
  this.height = this.canvas.height

  if(!this.canvas) {
    console.error("No canvas rendering target found.")
    return
  }

  this.ctx = this.canvas.getContext("2d")

  this.drawSprite = function(img,x,y,rotation,scale) {
    if(!scale) scale = .1
    if(!rotation) rotation = 0
    var width = img.width*scale
    var height = img.height*scale
    this.ctx.translate(x - width/2, y - height/2)
    this.ctx.rotate(rotation*Math.PI/180)
    this.ctx.drawImage(img, 0, 0, width, height )
    this.ctx.rotate(-rotation*Math.PI/180)
    this.ctx.translate(-x + width/2, -y + height/2)
  }

  this.drawBackground = function(img,x,y) {

    this.ctx.translate(x, y)
    var pattern = this.ctx.createPattern(img, 'repeat')
    this.ctx.fillStyle = pattern
    this.ctx.fillRect( -x,-y, this.width, this.height)
    this.ctx.translate(-x, -y)
  }

  this.clear = function() {
    this.ctx.clearRect(0,0,this.width,this.height);
  }
}
