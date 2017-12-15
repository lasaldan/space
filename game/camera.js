var Camera = function() {
  this.tracking = false
  this.xOffset = 0
  this.yOffset = 0
  this.x = function() {
    if(!this.tracking)
      return -this.xOffset
    else
      return -this.tracking.body.x
  }
  this.y = function() {
    if(!this.tracking)
      return -this.yOffset
    else
      return -this.tracking.body.y
  }

  this.track = function(sprite) {
    this.tracking = sprite
  }
}
