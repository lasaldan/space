var Sound = function(src, options) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  if(options && options.loop) this.sound.setAttribute("loop", "loop")
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
  this.volumeUp = function(step, max) {
    if(this.sound.volume == max) return
    step = step || 1
    max = max || 1
    this.sound.volume = Math.min(this.sound.volume + step, max, 1)
  }
  this.volumeDown = function(step, min) {
    if(this.sound.volume == min) return
    step = step || 1
    min = min || 0
    this.sound.volume = Math.max(this.sound.volume - step, min, 0)
  }
  this.setVolume = function(val) {
    this.sound.volume = val
  }
}
