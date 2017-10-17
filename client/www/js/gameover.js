var GameOver = function(game){};

GameOver.prototype = {

    create: function(){
      console.lg("GameOver State")

    },

    restartGame: function(){
        this.game.state.start("GameTitle");
    }

}
