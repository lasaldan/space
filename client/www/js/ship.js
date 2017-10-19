var Ship = function() {
  this.enginePower = 400
  this.handling = 100
  this.fireRate = 200
  this.nextFire = 0
  this.projectileSpeed = 1500
  this.mass = 100
  this.topSpeed = 750

  this.setPower = function(val) {
    this.enginePower = val
  }

  this.setHandling = function(val) {
    this.handling = val
  }

  this.setMass = function(val) {
    this.mass = val
  }
}
