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

function drawDiamondObject(obj) {
    // Begin path for the diamond
    ctx.beginPath();
    ctx.moveTo(obj.x, obj.y - obj.size); // Top point
    ctx.lineTo(obj.x + obj.size, obj.y); // Right point
    ctx.lineTo(obj.x, obj.y + obj.size); // Bottom point
    ctx.lineTo(obj.x - obj.size, obj.y); // Left point
    ctx.closePath();

    // Fill the diamond
    ctx.fillStyle = obj.backgroundColor || 'lightgreen';
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

/**
 * Draws a directional arrow from one point to another.
 * @param {number} x1 - Starting x-coordinate.
 * @param {number} y1 - Starting y-coordinate.
 * @param {number} x2 - Ending x-coordinate.
 * @param {number} y2 - Ending y-coordinate.
 */
function drawArrow(x1, y1, x2, y2) {
    const arrowLength = 10; // Length of the arrowhead lines
    const arrowAngle = Math.PI / 6; // Angle of the arrowhead (30°)
    
    // Draw the main line (arrow shaft)
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 1;
    ctx.stroke();
  
    // Calculate the angle of the line
    const angle = Math.atan2(y2 - y1, x2 - x1);
  
    // Calculate arrowhead points with trigonometry!
    
    const arrowPoint1 = {
        x: x2 - arrowLength * Math.cos(angle - arrowAngle),
        y: y2 - arrowLength * Math.sin(angle - arrowAngle)
    };
    const arrowPoint2 = {
        x: x2 - arrowLength * Math.cos(angle + arrowAngle),
        y: y2 - arrowLength * Math.sin(angle + arrowAngle)
    };

    // Draw the arrowhead
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(arrowPoint1.x, arrowPoint1.y);
    ctx.lineTo(arrowPoint2.x, arrowPoint2.y);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();
}


