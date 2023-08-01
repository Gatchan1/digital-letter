const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

let sprite = document.createElement("img");
sprite.src = "./images/Sprite-0005.png"

let initialX = 25;
let initialY = 60;
let charWidth = 15;
let charHeight = 20;
let x = initialX;
let y = initialY;
let backspaceCount = 0;

const spriteChars = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z"]

document.body.addEventListener("keydown", (e)=>{
    //and or?!?!??
    if (e.key === " ") { 
        e.preventDefault() //This is for preventing scroll down when the space bar is pressed.
    }
    if (e.key !== "Shift" && e.key !== "Dead" && e.key !== "Control" && e.key !== "Backspace" && e.key !== "Enter"&& e.key !== "Tab") {
        // if (/[0123456789qwertyuiopasdfghjklñzxcvbnmáéíóú ¡!'^+%&/()=¿?_\-~`:;#$½{[\]}\\|<>@.,]/gi.test(e.key)) {
        //     x += (12*backspaceCount);
        //     ctx.font = "20px Courier"
        //     ctx.fillText(e.key, x, y);
        //     x += 12;
        //     backspaceCount = 0;
        // }


        if (/[0123456789abcdefghijklmnñopqrstuvwxyzáéíóú ¡!'^+%&/()=¿?_\-~`:;#$½{[\]}\\|<>@.,]/gi.test(e.key)) {
            x += (charWidth*backspaceCount);

            let charIndex = spriteChars.indexOf(e.key)
            // console.log("character index:",charIndex)

            // find position of e.key in spriteChars array!!!
            ctx.drawImage(sprite, charIndex * 15, 0, charWidth, 20, x, y, charWidth, 20)
            x += charWidth;
            backspaceCount = 0;
        }

        /* if (e.key === "a") {
            x += (charWidth*backspaceCount);
            ctx.drawImage(sprite, 0, 0, charWidth, 20, x, y, charWidth, 20)
            x += charWidth;
            backspaceCount = 0;
        } */
    };
    if (e.key === "Backspace") {
        x -= charWidth;
        ctx.fillRect(x,(y-1),charWidth,20);
        backspaceCount += 1;
    };
    if (e.key === "Enter") {
        if (y <= (1020-initialY)) {
            y += 30;
            x = initialX;
        }        
        // console.log("this is where we are now: ", y)
    };
    if (e.key === "Tab") { 
        e.preventDefault(); // Typing tab targets different buttons across the browser. We want to prevent this.
        x += initialX;
    }
})