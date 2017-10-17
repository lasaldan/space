var Main = function(game){

};

Main.prototype = {

    create: function() {
      console.log("Main State")
      game.player = new Player()

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

    },

    update: function() {

      velocity = Phaser.Math.distance(this.ship.body.velocity.destination[0], this.ship.body.velocity.destination[1],0,0)
      console.log(velocity)

      if(this.spacebar.isDown) {

        if (game.time.now > game.player.ship.nextFire && this.bullets.countDead() > 0)
        {

          game.player.ship.nextFire = game.time.now + game.player.ship.fireRate;

          var bullet = this.bullets.getFirstExists(false);
          bullet.reset(this.ship.x + Math.sin(this.ship.rotation)*100, this.ship.y - Math.cos(this.ship.rotation)*100)
          bullet.body.rotation = this.ship.rotation;
          bullet.body.mass = 100
          bullet.body.damping = 0
          bullet.body.moveForward(1000)
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

    },

    gameOver: function(){
        this.game.state.start('GameOver');
    },

};
