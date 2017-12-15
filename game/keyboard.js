var Keyboard = function() {

  keyboard = this;

  keyboard.keys = {
    up: false,
    down: false,
    right: false,
    left: false,
    space: false
  }

  keyboard.keyDown = function(e) {
    if(e.keyCode == 37) keyboard.keys.left = true
    if(e.keyCode == 38) keyboard.keys.up = true
    if(e.keyCode == 39) keyboard.keys.right = true
    if(e.keyCode == 40) keyboard.keys.down = true
    if(e.keyCode == 32) keyboard.keys.space = true
  }

  keyboard.keyUp = function(e) {
    if(e.keyCode == 37) keyboard.keys.left = false
    if(e.keyCode == 38) keyboard.keys.up = false
    if(e.keyCode == 39) keyboard.keys.right = false
    if(e.keyCode == 40) keyboard.keys.down = false
    if(e.keyCode == 32) keyboard.keys.space = false
  }

  document.addEventListener("keydown", keyboard.keyDown)
  document.addEventListener("keyup", keyboard.keyUp)
}
