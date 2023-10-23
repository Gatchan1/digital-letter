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
// sprite.src = "./images/font1.png" // char.index * 15
sprite.src = "./images/font2.png"; // char.index * 7

const audioEndOfLine = new Audio("./audio/default.wav");

const char = {
  x: 45,
  y: 60,
  width: 14,
  height: 20,
  initialX: 45,
  initialY: 60,
  backspaceCount: 0,
  row: 0,
  index: 0,
  moveNext: function () {
    this.x += this.width;
  },
  movePrior: function () {
    this.x -= this.width;
  },
  moveNewLine: function() {
    this.y += 30; // move to next line
    this.x = this.initialX; // start of line
  },
  endStrikethrough: function () {
    this.x += this.width * this.backspaceCount;
  },
  draw: function () {
    canvasText.ctx.drawImage(
      sprite, // image
      (this.index % 27) * 7, // x position in sprite
      this.row * 10, // y position in sprite
      7, // width in sprite
      10, // height in sprite
      this.x, // x position in canvas
      this.y, // y position in canvas
      this.width, // width in canvas
      this.height // height in canvas
    );
  },
  sprites: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "á", "é", "í", "ó", "ú", "Á", "É", "Í", "Ó", "Ú", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", ",", ";", ":", "-", "_", "~", "¡", "!", "¿", "?", "(", ")", "[", "]", "{", "}", "<", ">", "^", "'", '"', "`", "+", "=", "/", "\\", "%", "&", "#", "$", "½", "|", "@"],
};

const cursor = {
  draw: function () {
    canvasCursor.ctx.fillStyle = "#99755d";
    canvasCursor.ctx.fillRect(char.x + 4, char.y - 2, 2, 20);
  },
  erase: function () {
    // clear whole canvas
    canvasCursor.ctx.clearRect(0, 0, 800, 1050);
  },
};

class Sticker {
  constructor(fileName) {
    this.designs = {
      washi1: {
        width: 53,
        height: 22
      },
      bunny : {
        width: 26,
        height: 30
      }
    }
    this.w = this.designs[`${fileName}`].width * 3;
    this.h = this.designs[`${fileName}`].height * 3;
    this.x = 400 - this.w / 2;
    this.y = 0;
    this.image = document.createElement("img");
    this.image.src = `./images/${fileName}.png`;
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
    if (this.position == "below")
      canvasStickerBelow.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    else
      canvasStickerAbove.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
  }
  deactivate() {
    this.active = false;
  }
}

const nextSticker = {
  design: "",
  position: "",
}
const stickers = [];

const stickerBtns = document.querySelectorAll("button.sticker");
const btnBelow = document.querySelector("button#sticker-below");
const btnAbove = document.querySelector("button#sticker-above");
const btnSetSticker = document.querySelector("button#set-sticker");

for (let i = 0; i < stickerBtns.length; i++) {
  stickerBtns[i].addEventListener("click", (e) => {
    nextSticker.design = e.currentTarget.id;
    for (let i = 0; i < stickerBtns.length; i++) {
      stickerBtns[i].classList.replace("btn-info", "btn-outline-info");
    }
    document.getElementById(e.currentTarget.id).classList.replace("btn-outline-info", "btn-info");
    if (nextSticker.design && nextSticker.position) btnSetSticker.disabled = false;
  });
}
btnBelow.addEventListener("click", (e) => {
  nextSticker.position = "below";
  btnBelow.classList.replace("btn-outline-info", "btn-info");
  btnAbove.classList.replace("btn-info", "btn-outline-info");
  if (nextSticker.design && nextSticker.position) btnSetSticker.disabled = false;
});
btnAbove.addEventListener("click", (e) => {
  nextSticker.position = "above";
  btnAbove.classList.replace("btn-outline-info", "btn-info");
  btnBelow.classList.replace("btn-info", "btn-outline-info");
  if (nextSticker.design && nextSticker.position) btnSetSticker.disabled = false;
});
btnSetSticker.addEventListener("click", (e) => {
  stickers.forEach((sticker) => sticker.deactivate());
  stickers.push(new Sticker(nextSticker.design));
  stickers[stickers.length - 1].position = nextSticker.position;
  btnBelow.classList.replace("btn-info", "btn-outline-info");
  btnAbove.classList.replace("btn-info", "btn-outline-info");
  for (let i = 0; i < stickerBtns.length; i++) {
    stickerBtns[i].classList.replace("btn-info", "btn-outline-info");
  }
});

document.body.addEventListener("keydown", (e) => {
  document.getElementById("tutorial").style.display = "none";
  if (!stickers[stickers.length - 1] || !stickers[stickers.length - 1].active) {
    if ("0123456789abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóúÁÉÍÓÚ.,;:-_~¡!¿?()[]{}<>^'\"`+=/\\%&#$½|@".includes(e.key)) {
      char.index = char.sprites.indexOf(e.key);
      //console.log("character index:", e.key, char.index);

      char.endStrikethrough();

      if (char.x <= 735) {
        cursor.erase();
        if (char.index >= 0 && char.index < 27) char.row = 0;
        if (char.index >= 27 && char.index < 54) char.row = 1;
        if (char.index >= 54 && char.index < 81) char.row = 2; // (character "~" still not working)
        if (char.index >= 81 && char.index < 108) char.row = 3;
        if (char.index >= 108 && char.index < 135) char.row = 4;
        //console.log("x position: ", char.x);
        char.draw();
        char.moveNext();
        cursor.draw();
        char.backspaceCount = 0;
      } else if (char.x > 735 && char.x <= 750) {
        // Too near to the right limit. Only non alphabetical characters are allowed. (750 is the real limit)
        if (char.index >= 0 && char.index < 64) {
          audioEndOfLine.play();
        }
        if (char.index >= 64) {
          cursor.erase();
          if (char.index >= 64 && char.index < 81) char.row = 2;
          if (char.index >= 81 && char.index < 108) char.row = 3;
          if (char.index >= 108 && char.index < 135) char.row = 4;
          char.draw();
          char.moveNext();
          cursor.draw();
          char.backspaceCount = 0;
        }
      } else if (char.x > 750) {
        audioEndOfLine.play();
      }
    }

    if (e.key === " ") {
      e.preventDefault(); // This is for preventing scroll down when pressing the space bar.
      if (char.x > 750) {
        audioEndOfLine.play();
      } else {
        char.endStrikethrough();
        char.backspaceCount = 0;
        cursor.erase();
        char.moveNext();
        cursor.draw();
      }
    }
    if (e.key === "Backspace") {
      if (char.x > 750) char.x = 750;
      char.movePrior();
      const crossOut = Math.floor(Math.random() * 7);
      canvasText.ctx.drawImage(sprite, crossOut * 7, 4 * 10, 7, 10, char.x, char.y, char.width, char.height);
      char.backspaceCount += 1;
    }
    if (e.key === "Enter") {
      e.preventDefault(); // It would activate the first button on the site (the sticker modal)
      if (char.y <= 1020 - char.initialY) {
        // lower limit of the page
        cursor.erase();
        char.moveNewLine();
        cursor.draw();
        char.backspaceCount = 0;
      }
      // console.log("this is where we are now: ", y)
    }
    if (e.key === "Tab") {
      e.preventDefault(); // Typing tab targets different buttons across the browser. We want to prevent this.
      if (char.x > 735) {
        audioEndOfLine.play();
      } else {
        char.endStrikethrough();
        char.backspaceCount = 0;
        cursor.erase();
        char.x += char.initialX; // advance tab distance
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

const update = function () {
  // CLEAN
  canvasStickerBelow.ctx.clearRect(0, 0, 800, 1050);
  canvasStickerAbove.ctx.clearRect(0, 0, 800, 1050);

  //REDRAW
  stickers.forEach((sticker) => sticker.print());
};

setInterval(update, 60);
cursor.draw();