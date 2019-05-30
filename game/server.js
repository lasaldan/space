var Server = function(options) {

    this.socket = io.connect("http://localhost:8081");
    // this.Server.socket = io.connect("http://d2f6ad84.ngrok.io");
    //game.Client.socket = io.connect("http://bf863ee2.ngrok.io");

    this.join = function() {
      this.socket.emit('playerConnected');
    };

    // this.Server.fire = function() {
    //   this.socket.emit('fire', state.messageId++)
    // }
    //
    // this.Server.reverse = function() {
    //   this.socket.emit('reverse', state.messageId++)
    // }
    //
    // this.Server.thrust = function() {
    //   this.socket.emit('thrust', state.messageId++)
    // }
    //
    // this.Server.impulseForward = function() {
    //   this.socket.emit('impulseForward', state.messageId++)
    // }
    //
    // this.Server.impulseBackward = function() {
    //   this.socket.emit('impulseBackward', state.messageId++)
    // }
    //
    // this.Server.rotateRight = function() {
    //   this.socket.emit('rotateRight', state.messageId++)
    // }
    //
    // this.Server.rotateLeft = function() {
    //   this.socket.emit('rotateLeft', state.messageId++)
    // }
    //
    // this.Server.socket.on('fire', function(data) {
    //   var bullet = game.addSprite(null, "projectiles", {image: game.images.bullet})
    //   game.enablePhysicsOn(bullet.key, data)
    // })
    //
    // this.Server.socket.on('removeProjectile', function() {
    //   game.destroySprite()
    // })
    //
    // this.Server.socket.on("accelerateBody", function(id, amount) {
    //   game.getSprite(id+"ship", "stage").body.thrust(amount)
    // })
    //
    // this.Server.socket.on("rotateBody", function(id, amount) {
    //   game.getSprite(id+"ship", "stage").body.rotateRight(amount)
    // })
    //
    // this.Server.socket.on('playerConnected',function(player){
    //   gameData.players[player.id] = player
    //   var p = game.addSprite(player.id+"ship", "stage", {scale: .15, image: game.images.ship, frameMap: shipFrames, com: player.ship.com})
    //   p.setFrame("default")
    //   game.enablePhysicsOn(player.id+"ship", player.ship)
    //
    //   console.log("new player connected: ", player)
    // });
    //
    // this.Server.socket.on('playerDisconnected',function(id){
    //   game.destroySprite(id+"ship", "stage")
    //   delete gameData.players[id]
    //   console.log("player disconnected: ", id)
    // });
    //
    // this.Server.socket.on('universe',function(data){
    //   // console.log("universe", data);
    //   // Object.keys(data.data.players).forEach(function(p) {
    //   //   var id = data.players[p].id
    //   //   if(id != state.playerId) {
    //   //     var ship = data.players[p].ship
    //   //     var player = game.addSprite(id+"ship", "stage", {scale: .15, image: game.images.ship, frameMap: shipFrames})
    //   //     player.setFrame("default")
    //   //     game.enablePhysicsOn(id+"ship", ship)
    //   //   }
    //   // })
    //   // gameData = data;
    // });
    //
    this.socket.on('welcomePlayer',function(data){
      console.log("Player Info:", data);
      // state.ship = game.addSprite("ship", "stage", {scale: .15, frameMap: shipFrames, com: data.ship.com})
      // state.weapon = data.ship.weapon
      // state.playerId = data.id
      // state.playerInfo = data
      //
      // game.enablePhysicsOn("ship", data.ship.body)
      //
      // game.camera.track(state.ship)
      // console.log("Welcome")
      // state.loaded = true
    });
}
