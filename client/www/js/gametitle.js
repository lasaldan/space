var GameTitle = function(game){};

GameTitle.prototype = {

    create: function(){
      console.log("Title State")
      this.bg = game.add.tileSprite(0,0, this.game.width, this.game.height, 'bg1')
      this.bg2 = game.add.tileSprite(0,0, this.game.width, this.game.height, 'bg2')
      // this.bg.tileScale.x=0.5
      // this.bg.tileScale.y=0.5
      this.startGame()
    },

    update: function() {
      this.bg.tilePosition.x --
      this.bg2.tilePosition.x -=2
    },

    startGame: function(){
        this.game.state.start("Main");
    }

}
