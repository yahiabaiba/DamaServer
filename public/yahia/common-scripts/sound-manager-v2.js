Yahia.Sounds = [];

Yahia.Sounds.move  = 0;
Yahia.Sounds.drop  = 1;
Yahia.Sounds.win   = 2;
Yahia.Sounds.lose  = 3;
Yahia.Sounds.draw  = 4;
Yahia.Sounds.page  = 5;
Yahia.Sounds.start = 6;
Yahia.Sounds.hint  = 7;
Yahia.Sounds.popup = 8;

Yahia.Controller.soundOff = false;

(function() {

var sounds  = [];
var current = null;
var cnt     = 0;

function Sound(src, clonable) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.clonable = clonable;
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

Yahia.Controller.addSound = function(ix, src, clonable) {
    sounds[ix + "_1"] = new Sound(src, clonable);
}

var getSound = function(ix, player) {
    if (!_.isUndefined(sounds[ix + "_1"])) {
        var parent = sounds[ix + "_1"];
        if ((parent.clonable) && (player != 1)) {
           if (_.isUndefined(sounds[ix + "_" + player])) {               
               sounds[ix + "_" + player] = new Sound(parent.sound.src, parent.clonable);
           }
           return sounds[ix + "_" + player];
        }
        return parent;
    }
    return null;
}

Yahia.Controller.play = function(ix, player) {
    if (Yahia.Controller.soundOff) return;
    Yahia.Controller.stop();
    cnt++;
    if (cnt > 2) {
        cnt = 1;
    }
    current = getSound(ix, cnt);
    if (current !== null) {
        current.play();
    }
}

Yahia.Controller.stop = function() {
    if (current !== null) {
        current = null;
    }
}

Yahia.Controller.sound = function() {
    if (Yahia.Controller.soundOff) {
        sound.innerHTML = "no Sound";
        Yahia.Controller.soundOff = false;
        localStorage.setItem('yahia.sound', 'on');
    } else {
        sound.innerHTML = "Sound";
        Yahia.Controller.soundOff = true;
        localStorage.setItem('yahia.sound', 'off');
    }
}

Yahia.Controller.checkSound = function() {
   var result = localStorage.getItem('yahia.sound');
   if (result == 'off') {
       sound.innerHTML = "Sound";
       Yahia.Controller.soundOff = true;
   } else {
       sound.innerHTML = "no Sound";
       Yahia.Controller.soundOff = false;
   }
}

})();

Yahia.Controller.checkSound();

Yahia.Controller.addSound(Yahia.Sounds.move, "sounds/clack.wav", true);
Yahia.Controller.addSound(Yahia.Sounds.drop, "sounds/on.wav", true);
Yahia.Controller.addSound(Yahia.Sounds.win,  "sounds/tadam.wav", true);
Yahia.Controller.addSound(Yahia.Sounds.lose, "sounds/loss.wav", true);
Yahia.Controller.addSound(Yahia.Sounds.draw, "sounds/draw.ogg", true);
Yahia.Controller.addSound(Yahia.Sounds.page, "sounds/page.wav", true);
Yahia.Controller.addSound(Yahia.Sounds.hint, "sounds/bird.wav", true);
Yahia.Controller.addSound(Yahia.Sounds.popup, "sounds/popup.wav", true);
