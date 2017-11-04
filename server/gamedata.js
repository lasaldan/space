module.exports = {
  Defaults: {
    weapons: [
      {
        name: "Pulse Cannon",
        fireRate: 1000,
        speed: 1000,
        projectileType: "ballistic",
        sprite: "projectile1.png"
      }
    ],
    ships: [
      { // 0
        name: "Falcon",
        enginePower: 400,
        handling: 150,
        sprite: "falcon.png",
        weapon: 0
      }
    ],
    stations: [
      {
        name: "Alpha Base",
        location: {x: 0, y: 0}
      }
    ],
    player: {
      name: "Pilot",
      spawn: {x: 0, y: 0},
      ship: 0,
      rotation: 0
    }
  }
}
