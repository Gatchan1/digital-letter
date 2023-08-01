const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const sprite = document.createElement("img");
// sprite.src = "./images/Sprite-0005.png" // charIndex * 15
sprite.src = "./images/Sprite-0007.png"; // charIndex * 7

const reachedEnd = new Audio("./audio/default.wav");

const initialX = 45;
const initialY = 60;
const charWidth = 15;
const charHeight = 20;
let x = initialX;
let y = initialY;
let backspaceCount = 0;

const spriteChars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
"á", "é", "í", "ó", "ú", "Á", "É", "Í", "Ó", "Ú", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", ",", ";", ":", "-", "_", "~",
"¡", "!", "¿", "?", "(", ")", "[", "]", "{", "}", "<", ">", "^", "'", '"', "`", "+", "=", "/", "\\", "%", "&", "#", "$", "½", "|", "@"];

document.body.addEventListener("keydown", (e) => {
  if (e.key !== "Shift" && e.key !== "Dead" && e.key !== "Control" && e.key !== "Backspace" && e.key !== "Enter" && e.key !== "Tab" && e.key !== " ") {
    if (/[0123456789abcdefghijklmnñopqrstuvwxyzáéíóú.,;:\-_~ ¡!¿?()[\]{}<>^'"`+=/\\%&#$½|@]/gi.test(e.key)) {
      x += charWidth * backspaceCount;

      const charIndex = spriteChars.indexOf(e.key);
      console.log("character index:", e.key, charIndex);
      let row;

      function drawChar() {
        ctx.drawImage(
          sprite, // image
          (charIndex % 27) * 7, // x position in sprite
          row * 10, // y position in sprite
          7, // width in sprite
          10, // height in sprite
          x, // x position in canvas
          y, // y position in canvas
          charWidth, // width in canvas
          charHeight // height in canvas
        );
      }

      if (x <= 735) { 
        if (charIndex >= 0 && charIndex < 27) row = 0;
        if (charIndex >= 27 && charIndex < 54) row = 1;
        if (charIndex >= 54 && charIndex < 81) row = 2; // (character "~" still not working)
        if (charIndex >= 81 && charIndex < 108) row = 3;
        if (charIndex >= 108 && charIndex < 135) row = 4;
        console.log("x position: ", x);
        drawChar();
        x += charWidth;
        backspaceCount = 0;
      } else if (x > 735 && x <= 750) { // Too near to the right limit. Only non alphabetical characters are allowed. (751 is the real limit)
        if (charIndex >= 0 && charIndex < 64) {
          reachedEnd.play();
        }
        if (charIndex >= 64) {
          if (charIndex >= 64 && charIndex < 81) row = 2;
          if (charIndex >= 81 && charIndex < 108) row = 3;
          if (charIndex >= 108 && charIndex < 135) row = 4;
          drawChar();
          x += charWidth;
          backspaceCount = 0;
        }
      }
    }
  }

  if (e.key === " ") {
    e.preventDefault(); // This is for preventing scroll down when pressing the space bar.
    x += charWidth;
  }
  if (e.key === "Backspace") {
    if (x >750) x = 750;
    x -= charWidth;
    const crossOut = Math.floor(Math.random() * 7);
    console.log("borrandoooo", crossOut);
    // ctx.fillRect(x,(y-1),charWidth,20);
    ctx.drawImage(sprite, crossOut * 7, 4 * 10, 7, 10, x, y, charWidth, charHeight);
    backspaceCount += 1;
  }
  if (e.key === "Enter") {
    if (y <= 1020 - initialY) { // lower limit of the page
      y += 30;
      x = initialX;
      backspaceCount = 0;
    }
    // console.log("this is where we are now: ", y)
  }
  if (e.key === "Tab") {
    e.preventDefault(); // Typing tab targets different buttons across the browser. We want to prevent this.
    x += initialX;
  }
});
