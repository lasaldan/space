var Ship = require('./ships')

var playerDefaults = {
  name: "Pilot",
  spawn: {x: 0, y: 0},
  shipId: 0,
  rotation: 0
}

var ServerPlayer = function(id, physics) {

  var player = this

  player.physics = physics
  player.id = id
  player.name = playerDefaults.name

  player.ship = new Ship(playerDefaults.shipId, player.physics)

}

// Facade methods for convenience and speed
ServerPlayer.prototype.fire = function() {
  this.ship.weapon.fire()
}

ServerPlayer.prototype.rotateRight = function() {
  this.ship.rotateRight()
}

ServerPlayer.prototype.rotateLeft = function() {
  this.ship.rotateLeft()
}

ServerPlayer.prototype.assignShip = function(shipId) {
  this.ship = new Ship(shipId, this.physics)
}

ServerPlayer.prototype.thrust = function() {
  this.ship.thrust()
}

ServerPlayer.prototype.reverse = function() {
  this.ship.reverse()
}


module.exports = ServerPlayer
