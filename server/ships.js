var Weapon = require('./weapons')

var shipDefaults = [
  {
    name: "Falcon",
    enginePower: 600,
    handling: 300,
    sprite: "falcon.png",
    maxWeaponLevel: 3,
    passiveDevice: true,
    activeDevice: false,
    com: {x: 0, y: -10}
  }
]

var Ship = function(index, physics) {
  this.name = shipDefaults[index].name
  this.enginePower = shipDefaults[index].enginePower
  this.handling = shipDefaults[index].handling
  this.sprite = shipDefaults[index].sprite
  this.maxWeaponLevel = shipDefaults[index].maxWeaponLevel
  this.passiveDevice = shipDefaults[index].passiveDevice
  this.activeDevice = shipDefaults[index].activeDevice
  this.com = shipDefaults[index].com

  this.weapon = new Weapon(0, physics)

  this.body = physics.createBody({
    x: 0,
    y: 0,
    rotation: 0
  })
}

Ship.prototype.installWeapon = function(id) {
  this.weapon = new Weapon(id, this.physics)
}

Ship.prototype.rotateRight = function() {
  this.body.rotateRight(this.handling)
}

Ship.prototype.rotateLeft = function() {
  this.body.rotateLeft(this.handling)
}

Ship.prototype.thrust = function() {
  this.body.thrust(this.enginePower)
}

Ship.prototype.reverse = function() {
  this.body.reverse(this.enginePower)
}

module.exports = Ship
