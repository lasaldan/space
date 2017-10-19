var Main = function(game){

};

Main.prototype = {

  create: function() {
    console.log("Main State")
    game.player = new Player()
    game.Client.askNewPlayer();

    game.time.advancedTiming = true;


    this.bullet = false

    var worldSize = 50000

    game.world.setBounds(0, 0, worldSize, worldSize);

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.defaultRestitution = 0.8;

    this.bg = game.add.tileSprite(0,0, this.game.width, this.game.height, 'bg1')
    //this.bg2 = game.add.tileSprite(0,0, this.game.width, this.game.height, 'bg2')
    this.bg.fixedToCamera = true;
    this.ship = game.add.sprite(worldSize/2,worldSize/2, 'ship')
    this.ship.scale.setTo(.2)

    game.physics.p2.enable(this.ship);

    game.camera.follow(this.ship);

    this.playerGroup = game.physics.p2.createCollisionGroup()
    this.ship.body.setCollisionGroup(this.playerGroup)
    this.ship.body.mass = game.player.ship.mass

    this.bulletGroup = game.physics.p2.createCollisionGroup()
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.P2JS;
    this.bullets.createMultiple(50, 'bullet', 0, false);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);

    this.cursors = game.input.keyboard.createCursorKeys();
    this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT)


    game.limitSpeedP2JS = function(p2Body, maxSpeed) {
      var x = p2Body.velocity.x;
      var y = p2Body.velocity.y;
      if (Math.pow(x, 2) + Math.pow(y, 2) > Math.pow(maxSpeed, 2)) {
        var a = Math.atan2(y, x);
        x = Math.cos(a) * maxSpeed;
        y = Math.sin(a) * maxSpeed;
        p2Body.velocity.x = x;
        p2Body.velocity.y = y;
      }
      return p2Body;
    }

    // function constrainVelocity(sprite, maxVelocity) {
    //   if (!sprite || !sprite.body) {return;}
    //   var body = sprite.body
    //   var angle, currVelocitySqr, vx, vy;
    //   vx = body.data.velocity[0];
    //   vy = body.data.velocity[1];
    //   currVelocitySqr = vx * vx + vy * vy;
    //   if (currVelocitySqr > maxVelocity * maxVelocity) {
    //     angle = Math.atan2(vy, vx);
    //     vx = Math.cos(angle) * maxVelocity;
    //     vy = Math.sin(angle) * maxVelocity;
    //     body.data.velocity[0] = vx;
    //     body.data.velocity[1] = vy;
    //     console.log('limited speed to: '+maxVelocity);
    //   }
    // };


  },

  update: function() {

    //velocity = Phaser.Math.distance(this.ship.body.velocity.destination[0], this.ship.body.velocity.destination[1],0,0)
    velocity = Phaser.Math.distance(this.ship.body.velocity.x, this.ship.body.velocity.y,0,0)

    if(this.spacebar.isDown) {

      if (game.time.now > game.player.ship.nextFire && this.bullets.countDead() > 0)
      {
        game.player.ship.nextFire = game.time.now + game.player.ship.fireRate;

        var bullet = this.bullets.getFirstExists(false);
        bullet.reset(this.ship.x + Math.sin(this.ship.rotation)*100, this.ship.y - Math.cos(this.ship.rotation)*100)
        bullet.body.rotation = this.ship.rotation;
        bullet.body.mass = 100
        bullet.body.damping = 0
        bullet.body.moveForward(game.player.ship.projectileSpeed)
        bullet.lifespan = 3000
        bullet.body.setCollisionGroup(this.bulletGroup)
        bullet.body.collides(this.playerGroup)

      }
    }

    if (this.cursors.left.isDown)
    {
      if(this.shift.isDown)
        this.ship.body.thrustLeft(game.player.ship.enginePower)
      else
        this.ship.body.rotateLeft(game.player.ship.handling);
    }

    else if (this.cursors.right.isDown)
    {
      if(this.shift.isDown)
        this.ship.body.thrustRight(game.player.ship.enginePower);
      else
        this.ship.body.rotateRight(game.player.ship.handling);
    }
    else
    {
        //this.ship.body.setZeroRotation();
        this.ship.body.angularVelocity *= .9
    }

    if (this.cursors.up.isDown)
    {
        this.ship.body.thrust(game.player.ship.enginePower);
    }
    else if (this.cursors.down.isDown)
    {
        this.ship.body.reverse(game.player.ship.enginePower);
    }

    if (!game.camera.atLimit.x)
    {
        this.bg.tilePosition.x -= (this.ship.body.velocity.x * game.time.physicsElapsed);
    }

    if (!game.camera.atLimit.y)
    {
        this.bg.tilePosition.y -= (this.ship.body.velocity.y * game.time.physicsElapsed);
    }

    game.limitSpeedP2JS(this.ship.body, game.player.ship.topSpeed)

  },

  render: function() {
    game.debug.text("FPS: " + game.time.fps || '--', 2, 16, "#00ff00");
    game.debug.text("Ship: " + parseInt(this.ship.x / 1000) + "," + parseInt(this.ship.y/ 1000) || '--', 2, 32, "#00ff00");
  },

  gameOver: function(){
      this.game.state.start('GameOver');
  },

};
