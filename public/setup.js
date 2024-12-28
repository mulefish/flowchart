let H = undefined
let W = undefined
// Get the canvas and context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// // Set the canvas size dynamically
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.2; // 1/5 of the screen height
}

resizeCanvas();
window.addEventListener('resize', () => {
    H = window.innerHeight * 0.2;
    W = window.innerWidth;
    document.getElementById("H").innerHTML = "H=" + H;
    document.getElementById("W").innerHTML = "W=" + W;
    resizeCanvas();
});



function drawDiamondObject(obj) {
    // Begin path for the diamond
    ctx.beginPath();
    ctx.moveTo(obj.x, obj.y - obj.size); // Top point
    ctx.lineTo(obj.x + obj.size, obj.y); // Right point
    ctx.lineTo(obj.x, obj.y + obj.size); // Bottom point
    ctx.lineTo(obj.x - obj.size, obj.y); // Left point
    ctx.closePath();

    // Fill the diamond
    ctx.fillStyle = 'lightgreen';
    ctx.fill();

    // Draw the border
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Draw the text in the center
    ctx.font = '14px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(obj.type, obj.x, obj.y);
}

// function drawBoxObject(obj) {
//     // Draw the square
//     ctx.fillStyle = 'lightblue';
//     ctx.fillRect(obj.x, obj.y, obj.size, obj.size);

//     // Draw the border
//     ctx.strokeStyle = 'black';
//     ctx.strokeRect(obj.x, obj.y, obj.size, obj.size);

//     // Draw the text
//     ctx.font = '14px Arial';
//     ctx.fillStyle = 'black';
//     ctx.fillText(obj.type, obj.x + 5, obj.y + obj.size / 2 + 5); // Slight adjustment for alignment
// }
function drawBoxObject(obj) {
    // Draw the square with dynamic background color
    ctx.fillStyle = obj.backgroundColor || 'lightblue';
    ctx.fillRect(obj.x, obj.y, obj.size, obj.size);

    // Draw the border
    ctx.strokeStyle = 'black';
    ctx.strokeRect(obj.x, obj.y, obj.size, obj.size);

    // Draw the text
    ctx.font = '14px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(obj.type, obj.x + obj.size / 2, obj.y + obj.size / 2);
}
