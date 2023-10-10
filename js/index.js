const canvas = document.getElementById("canvas");
const canvas2 = document.getElementById("canvas2");
const canvas3 = document.getElementById("canvas3");
const ctx = canvas.getContext("2d"); // stickers
const ctx2 = canvas2.getContext("2d"); // writing and crossing-out.
const ctx3 = canvas3.getContext("2d"); // this one is for the cursor.
ctx.imageSmoothingEnabled = false;
ctx2.imageSmoothingEnabled = false;
ctx3.imageSmoothingEnabled = false;

const sprite = document.createElement("img");
// sprite.src = "./images/font1.png" // charIndex * 15
sprite.src = "./images/font2.png"; // charIndex * 7

const washi1 = document.createElement("img");
washi1.src = "./images/washi1.png";

const reachedEnd = new Audio("./audio/default.wav");

const writing = {
  initialX: 45,
  initialY: 60,
  charWidth: 14,
  charHeight: 20,
  x: 45,
  y: 60,
  backspaceCount: 0,
  spriteChars: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "á", "é", "í", "ó", "ú", "Á", "É", "Í", "Ó", "Ú", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", ",", ";", ":", "-", "_", "~", "¡", "!", "¿", "?", "(", ")", "[", "]", "{", "}", "<", ">", "^", "'", '"', "`", "+", "=", "/", "\\", "%", "&", "#", "$", "½", "|", "@"],
};

const cursor = {
  draw: function () {
    ctx3.fillStyle = "#99755d";
    ctx3.fillRect(writing.x + 4, writing.y - 2, 2, 20);
  },
  erase: function () {
    // clear whole canvas
    ctx3.clearRect(0, 0, 800, 1050);
  },
};

const stickers = [];

class Sticker {
  constructor() {
    this.w = 151;
    this.h = 63;
    this.x = 400 - this.w / 2;
    this.y = 0;
    this.image = washi1;
    this.active = true;
  }
  recalculatePosition(incX, incY) {
    if (this.active == true) {
      this.x += incX;
      this.y += incY;
    }
  }
  print() {
    ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
  }
}

document.getElementById("btn-washi1").addEventListener("click", (e) => {
  stickers.forEach((sticker) => (sticker.active = false));
  stickers.push(new Sticker());
});

const update = function () {
  // CLEAN
  ctx.clearRect(0, 0, 800, 1050);

  //REDRAW
  stickers.forEach((sticker) => sticker.print());
};

setInterval(update, 60);

document.body.addEventListener("keydown", (e) => {
  if ("0123456789abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóúÁÉÍÓÚ.,;:-_~¡!¿?()[]{}<>^'\"`+=/\\%&#$½|@".includes(e.key)) {
    writing.x += writing.charWidth * writing.backspaceCount;

    const charIndex = writing.spriteChars.indexOf(e.key);
    console.log("character index:", e.key, charIndex);
    let row;

    function drawChar() {
      ctx2.drawImage(
        sprite, // image
        (charIndex % 27) * 7, // x position in sprite
        row * 10, // y position in sprite
        7, // width in sprite
        10, // height in sprite
        writing.x, // x position in canvas
        writing.y, // y position in canvas
        writing.charWidth, // width in canvas
        writing.charHeight // height in canvas
      );
      console.log("holaaaa", writing.x);
    }

    if (writing.x <= 735) {
      cursor.erase();
      if (charIndex >= 0 && charIndex < 27) row = 0;
      if (charIndex >= 27 && charIndex < 54) row = 1;
      if (charIndex >= 54 && charIndex < 81) row = 2; // (character "~" still not working)
      if (charIndex >= 81 && charIndex < 108) row = 3;
      if (charIndex >= 108 && charIndex < 135) row = 4;
      console.log("x position: ", writing.x);
      drawChar();
      writing.x += writing.charWidth;
      cursor.draw();
      writing.backspaceCount = 0;
    } else if (writing.x > 735 && writing.x <= 750) {
      // Too near to the right limit. Only non alphabetical characters are allowed. (750 is the real limit)
      if (charIndex >= 0 && charIndex < 64) {
        reachedEnd.play();
      }
      if (charIndex >= 64) {
        cursor.erase();
        if (charIndex >= 64 && charIndex < 81) row = 2;
        if (charIndex >= 81 && charIndex < 108) row = 3;
        if (charIndex >= 108 && charIndex < 135) row = 4;
        drawChar();
        writing.x += writing.charWidth;
        cursor.draw();
        writing.backspaceCount = 0;
      }
    } else if (writing.x > 750) {
      reachedEnd.play();
    }
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
    console.log("borrandoooo", crossOut);
    // ctx2.fillRect(x,(y-1),writing.charWidth,20);
    ctx2.drawImage(sprite, crossOut * 7, 4 * 10, 7, 10, writing.x, writing.y, writing.charWidth, writing.charHeight);
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

  // ---------------- STICKER KEYDOWNS ----------------
  if (e.key === "ArrowUp") {
    e.preventDefault(); // It would make the page scroll up.
    if (stickers[stickers.length - 1] && stickers[stickers.length - 1].active) {
      stickers[stickers.length - 1].recalculatePosition(0, -20);
    }
  }
  if (e.key === "ArrowRight") {
    e.preventDefault();
    if (stickers[stickers.length - 1] && stickers[stickers.length - 1].active) {
      stickers[stickers.length - 1].recalculatePosition(20, 0);
    }
  }
  if (e.key === "ArrowDown") {
   e.preventDefault(); // It would make the page scroll down.
    if (stickers[stickers.length - 1] && stickers[stickers.length - 1].active) {
      stickers[stickers.length - 1].recalculatePosition(0, 20);
    }
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    if (stickers[stickers.length - 1] && stickers[stickers.length - 1].active) {
      stickers[stickers.length - 1].recalculatePosition(-20, 0);
    }
  }
});
