var Preload = function(game){};

Preload.prototype = {

    preload: function(){
      game.load.image('ship', 'assets/ship.png');
      game.load.image('bg1', 'assets/bg1.jpg');
      game.load.image('bg2', 'assets/bg2.png');
      game.load.image('bullet', 'assets/projectile1.png'); 
    },

    create: function(){
        console.log("Preload State")
        this.game.state.start("GameTitle");
    }
}
