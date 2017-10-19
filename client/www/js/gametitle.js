var GameTitle = function(game){};

GameTitle.prototype = {

    create: function(){
      console.log("Title State")
      this.bg = game.add.tileSprite(0,0, this.game.width, this.game.height, 'bg1')
      this.bg2 = game.add.tileSprite(0,0, this.game.width, this.game.height, 'bg2')
      // this.bg.tileScale.x=0.5
      // this.bg.tileScale.y=0.5
      this.startGame()

      game.local = {}
      game.Client = {};
      //game.Client.socket = io.connect("http://localhost:8081");
      game.Client.socket = io.connect("http://bf863ee2.ngrok.io");
      game.Client.askNewPlayer = function(){
        game.Client.socket.emit('newplayer');
      };
      game.Client.socket.on('newplayer',function(player){
        game.local.players[player.id] = player
        console.log("new player added: ", player)
      });
      game.Client.socket.on('remove',function(id){
        delete game.local.players[id]
        console.log("player left game")
        console.log(id);
      });

      game.Client.socket.on('universe',function(data){
        console.log("Universe");
        console.log(data);
        game.local = data;
      });
    },

    update: function() {
      this.bg.tilePosition.x --
      this.bg2.tilePosition.x -=2
    },

    startGame: function(){
        this.game.state.start("Main");
    }

}
