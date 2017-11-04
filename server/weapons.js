var weaponDefaults = [
  {
    name: "Pulse Cannon",
    fireRate: 1000,
    speed: 1000,
    power: 100,
    projectileType: "ballistic",
    sprite: "projectile1.png"
  }
]

var Weapon = function(index, physics) {
  this.physics = physics
  this.name = weaponDefaults[index].name
  this.power = weaponDefaults[index].power
  this.fireRate = weaponDefaults[index].fireRate
  this.speed = weaponDefaults[index].speed
  this.projectileType = weaponDefaults[index].projectileType
  this.sprite = weaponDefaults[index].sprite
  this.nextFireTime = -1
}

Weapon.prototype.fire = function() {
  console.log("weapon fired for " + this.power + " damage")

  // var now = process.hrtime()
  // // var nsStamp = now[0]*physics.NS_PER_SEC + now[1]
  // // time =  (now[0]*physics.NS_PER_SEC + now[1]) - physics.simStart
  // time = ((now[0]*PhysD.lib.NS_PER_SEC + now[1]) - PhysD.lib.simStart)/PhysD.lib.MS_PER_SEC
  // console.log("Received fire() from " + socket.id + " at " + time + ". Can't fire until: " + socket.player.ship.weapon.nextFireTime)
  // if(time > socket.player.ship.weapon.nextFireTime) {
  //   console.log("Approved shot")
  //   socket.player.ship.weapon.nextFireTime = time + socket.player.ship.weapon.fireRate;
  //
  //   var x = socket.player.ship.body.x + Math.sin(socket.player.ship.body.rotation*Math.PI/180)*100
  //   var y = socket.player.ship.body.y - Math.cos(socket.player.ship.body.rotation*Math.PI/180)*100
  //   var vx = socket.player.ship.body.velocity.x + Math.sin(socket.player.ship.body.rotation*Math.PI/180)*1000
  //   var vy = socket.player.ship.body.velocity.y - Math.cos(socket.player.ship.body.rotation*Math.PI/180)*1000
  //   var definition = {lifespan: 3000, x: x, y: y, rotation: socket.player.ship.body.rotation, frictionless: true, vx: vx, vy: vy}
  //
  //   // Create projectile locally
  //   PhysD.lib.createBody(definition)
  //   socket.broadcast.emit("fire", id, transportBody(definition))
  // }
  // else {
  //   // Fired too soon on client - must remove projectile
  //   socket.emit("removeProjectile", id)
  // }
}

module.exports = Weapon
