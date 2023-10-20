class Canvas {
  constructor(name) {
    this.canvas = document.getElementById(name);
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
  }
}
const canvasStickerBelow = new Canvas("canvas1"); // sticker below text
const canvasText = new Canvas("canvas2"); // text
const canvasStickerAbove = new Canvas("canvas3"); // sticker above text
const canvasCursor = new Canvas("canvas4"); // cursor

const sprite = document.createElement("img");
// sprite.src = "./images/font1.png" // charIndex * 15
sprite.src = "./images/font2.png"; // charIndex * 7

const reachedEnd = new Audio("./audio/default.wav");

const writing = {
  initialX: 45,
  initialY: 60,
  charWidth: 14,
  charHeight: 20,
  x: 45,
  y: 60,
  backspaceCount: 0,
  row: 0,
  charIndex: 0,
  advanceNextCharPosition: function() {
    this.x += this.charWidth * this.backspaceCount;
  },
  drawChar: function () {
    canvasText.ctx.drawImage(
      sprite, // image
      (this.charIndex % 27) * 7, // x position in sprite
      this.row * 10, // y position in sprite
      7, // width in sprite
      10, // height in sprite
      this.x, // x position in canvas
      this.y, // y position in canvas
      this.charWidth, // width in canvas
      this.charHeight // height in canvas
    );
  },
  spriteChars: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "á", "é", "í", "ó", "ú", "Á", "É", "Í", "Ó", "Ú", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", ",", ";", ":", "-", "_", "~", "¡", "!", "¿", "?", "(", ")", "[", "]", "{", "}", "<", ">", "^", "'", '"', "`", "+", "=", "/", "\\", "%", "&", "#", "$", "½", "|", "@"],
};

const cursor = {
  draw: function () {
    canvasCursor.ctx.fillStyle = "#99755d";
    canvasCursor.ctx.fillRect(writing.x + 4, writing.y - 2, 2, 20);
  },
  erase: function () {
    // clear whole canvas
    canvasCursor.ctx.clearRect(0, 0, 800, 1050);
  },
};

const stickers = [];

class Sticker {
  constructor(width, height, fileName) {
    this.w = width;
    this.h = height;
    this.x = 400 - this.w / 2;
    this.y = 0;
    this.image = document.createElement("img");
    this.image.src = `./images/${fileName}`;
    this.active = true;
    this.position = "";
  }
  recalculatePosition(incX, incY) {
    if (this.active == true) {
      this.x += incX;
      this.y += incY;
    }
  }
  print() {
    canvasStickerBelow.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
  }
  deactivate() {
    this.active = false;
  }
}

document.getElementById("btn-washi1").addEventListener("click", (e) => {
  stickers.forEach((sticker) => sticker.deactivate());
  stickers.push(new Sticker(151, 63, "washi1.png"));
});

const update = function () {
  // CLEAN
  canvasStickerBelow.ctx.clearRect(0, 0, 800, 1050);

  //REDRAW
  stickers.forEach((sticker) => sticker.print());
};

setInterval(update, 60);
cursor.draw();

document.body.addEventListener("keydown", (e) => {
  document.getElementById("tutorial").style.display = "none";
  if (!stickers[stickers.length - 1] || !stickers[stickers.length - 1].active) {
    if ("0123456789abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóúÁÉÍÓÚ.,;:-_~¡!¿?()[]{}<>^'\"`+=/\\%&#$½|@".includes(e.key)) {
      writing.charIndex = writing.spriteChars.indexOf(e.key);
      //console.log("character index:", e.key, charIndex);

      if (writing.x <= 735) {
        cursor.erase();
        if (writing.charIndex >= 0 && writing.charIndex < 27) writing.row = 0;
        if (writing.charIndex >= 27 && writing.charIndex < 54) writing.row = 1;
        if (writing.charIndex >= 54 && writing.charIndex < 81) writing.row = 2; // (character "~" still not working)
        if (writing.charIndex >= 81 && writing.charIndex < 108) writing.row = 3;
        if (writing.charIndex >= 108 && writing.charIndex < 135) writing.row = 4;
        //console.log("x position: ", writing.x);
        writing.drawChar();
        writing.x += writing.charWidth;
        cursor.draw();
        writing.backspaceCount = 0;
      } else if (writing.x > 735 && writing.x <= 750) {
        // Too near to the right limit. Only non alphabetical characters are allowed. (750 is the real limit)
        if (writing.charIndex >= 0 && writing.charIndex < 64) {
          reachedEnd.play();
        }
        if (writing.charIndex >= 64) {
          cursor.erase();
          if (writing.charIndex >= 64 && writing.charIndex < 81) writing.row = 2;
          if (writing.charIndex >= 81 && writing.charIndex < 108) writing.row = 3;
          if (writing.charIndex >= 108 && writing.charIndex < 135) writing.row = 4;
          writing.drawChar();
          writing.x += writing.charWidth;
          cursor.draw();
          writing.backspaceCount = 0;
        }
      } else if (writing.x > 750) {
        reachedEnd.play();
      }

      writing.advanceNextCharPosition();
    }

    if (e.key === " ") {
      e.preventDefault(); // This is for preventing scroll down when pressing the space bar.
      if (writing.x > 750) {
        reachedEnd.play();
      } else {
        writing.x += writing.charWidth * writing.backspaceCount;
        writing.backspaceCount = 0;
        cursor.erase();
        writing.x += writing.charWidth;
        cursor.draw();
      }
    }
    if (e.key === "Backspace") {
      if (writing.x > 750) writing.x = 750;
      writing.x -= writing.charWidth;
      const crossOut = Math.floor(Math.random() * 7);
      canvasText.ctx.drawImage(sprite, crossOut * 7, 4 * 10, 7, 10, writing.x, writing.y, writing.charWidth, writing.charHeight);
      writing.backspaceCount += 1;
    }
    if (e.key === "Enter") {
      e.preventDefault(); // It would activate the first button on the site (the sticker modal)
      if (writing.y <= 1020 - writing.initialY) {
        // lower limit of the page
        cursor.erase();
        writing.y += 30;
        writing.x = writing.initialX;
        cursor.draw();
        writing.backspaceCount = 0;
      }
      // console.log("this is where we are now: ", y)
    }
    if (e.key === "Tab") {
      e.preventDefault(); // Typing tab targets different buttons across the browser. We want to prevent this.
      if (writing.x > 735) {
        reachedEnd.play();
      } else {
        writing.x += writing.charWidth * writing.backspaceCount;
        writing.backspaceCount = 0;
        cursor.erase();
        writing.x += writing.initialX;
        cursor.draw();
      }
    }
  }

  // ---------------- STICKER KEYDOWNS ----------------
  if (stickers[stickers.length - 1] && stickers[stickers.length - 1].active) {
    if (e.key === "ArrowUp") {
      e.preventDefault(); // It would make the page scroll up.
      stickers[stickers.length - 1].recalculatePosition(0, -20);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      stickers[stickers.length - 1].recalculatePosition(20, 0);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault(); // It would make the page scroll down.
      stickers[stickers.length - 1].recalculatePosition(0, 20);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      stickers[stickers.length - 1].recalculatePosition(-20, 0);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      stickers[stickers.length - 1].deactivate();
    }
  }
});
