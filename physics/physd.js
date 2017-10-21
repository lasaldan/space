var PhysD = function(worldWidth, worldHeight) {
  var physics = this
  physics.width = worldWidth
  physics.height = worldHeight
  physics.damping = .997

  physics.collisionGroups = {}

  physics.bodies = []
  physics.lastStep = undefined

  physics.stepSim = function(time) {
    if(!physics.lastStep) physics.lastStep = time

    var t = (time - physics.lastStep) / 1000
    physics.lastStep = time

    var count = physics.bodies.length
    for(var i = count-1; i >= 0; i--) {
      //physics.bodies.forEach(function(body,i) {
      body = physics.bodies[i]

      if(body) {
        if(body.lifespan) {
          if(!body.spawnTime)
            body.spawnTime = time

          if(time - body.spawnTime > body.lifespan) {
            body.onDelete()
            physics.bodies.splice(i,1)
          }
        }

        var tx = body.velocity.x*t + body.acceleration.x*0.5*t*t
        var ty = body.velocity.y*t + body.acceleration.y*0.5*t*t

        body.x += tx
        body.y += ty

        tx = body.velocity.x + body.acceleration.x*t
        ty = body.velocity.y + body.acceleration.y*t

        body.velocity.x = tx * ((body.frictionless)? 1 : physics.damping)
        body.velocity.y = ty * ((body.frictionless)? 1 : physics.damping)

        body.acceleration.x = 0
        body.acceleration.y = 0

        body.rotation += body.angularVelocity*t
      }
    }
  }

  physics.createBody = function(options) {
    var options = options || {}
    var body = {
      x: options.x || 0,
      y: options.y || 0,
      rotation: options.rotation || 0,
      mass: 100,
      frictionless: options.frictionless || false,
      lifespan: options.lifespan || false,
      acceleration: new physics.Vector(options.ax || 0, options.ay || 0),
      velocity: new physics.Vector(options.vx || 0, options.vy || 0),
      angularVelocity: options.angularVelocity || 0,
      onDelete: options.onDelete,
      thrust: function(amount) {
        this.acceleration.addInPlace({x: amount*Math.sin(this.rotation*Math.PI/180), y: -amount*Math.cos(this.rotation*Math.PI/180)})
      },
      reverse: function(amount) {
        this.thrust(-amount)
      },
      rotateRight: function(deg) {
        this.angularVelocity = deg
      },
      rotateLeft: function(deg) {
        this.rotateRight(-deg)
      }
    }
    physics.bodies.push(body)
    return body
  }

  physics.Vector = function(x,y) {
    var vector = this
    vector.x = x
    vector.y = y
  }

  physics.Vector.prototype.add = function(v) {
    var newX = this.x + v.x
    var newY = this.y + v.y
    return new physics.Vector(newX, newY)
  }
  physics.Vector.prototype.addInPlace = function(v) {
    this.x = this.x + v.x
    this.y = this.y + v.y
  }

  physics.Vector.prototype.magnitude = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y)
  }

  physics.Vector.prototype.subtract = function(v) {
    var newX = vector.x - v.x
    var newY = vector.y - v.y
    return new physics.Vector(newX, newY)
  }

  physics.Vector.prototype.scale = function(s) {
    return new physics.Vector(vector.x*s, vector.y*s)
  }

  physics.Vector.prototype.dot = function(v) {
    return vector.x * v.x + vector.y * v.y
  }

    // vector.cross = function(v) {
    //   // For 3d maybe down the road?
    // }

  physics.Vector.prototype.rotate = function(deg) {
    var newX = Math.cos(deg)*vector.x - Math.sin(deg)*vector.y
    var newY = Math.sin(deg)*vector.x + Math.cos(deg)*vector.y
    return new physics.Vector(newX, newY)
  }
}


  // game.addToCollisionGroup = function(spriteKey, collisionKey) {
  //   if(game.collidableGroups[collisionKey])
  //     game.collidableGroups[collisionKey].push(spriteKey)
  //   else {
  //     game.collidableGroups[collisionKey] = []
  //     game.collidableGroups[collisionKey].push(spriteKey)
  //   }
  // }
