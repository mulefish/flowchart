const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// // Set the canvas size dynamically
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.4; // 1/5 of the screen height
}

// Function to draw a square with text
function drawSquareWithText(x, y, size, text) {
  // Draw the square
  ctx.fillStyle = 'lightblue';
  ctx.fillRect(x, y, size, size);

  // Draw the border
  ctx.strokeStyle = 'black';
  ctx.strokeRect(x, y, size, size);

  // Draw the text
  ctx.font = '14px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(text, x + 5, y + size / 2 + 5); // Slight adjustment for alignment
}

function drawDiamondWithText(x, y, size, text) {
    // Begin path for the diamond
    ctx.beginPath();
    ctx.moveTo(x, y - size); // Top point
    ctx.lineTo(x + size, y); // Right point
    ctx.lineTo(x, y + size); // Bottom point
    ctx.lineTo(x - size, y); // Left point
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
    ctx.fillText(text, x, y);
  }

function drawArrow(x1, y1, x2, y2) {
    const arrowLength = 10;
    const arrowAngle = Math.PI / 6; // Angle of the arrowhead (30°)
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
  
    // Calculate the angle of the line
    const angle = Math.atan2(y2 - y1, x2 - x1);
  
    // Draw the arrowhead (two lines forming the arrow)
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - arrowLength * Math.cos(angle - arrowAngle),
      y2 - arrowLength * Math.sin(angle - arrowAngle)
    );
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - arrowLength * Math.cos(angle + arrowAngle),
      y2 - arrowLength * Math.sin(angle + arrowAngle)
    );
    ctx.stroke();
  }
  
  // Initial canvas setup
  resizeCanvas();
  window.addEventListener('resize', () => {
    document.getElementById("H").innerHTML = "H=" + H;
    document.getElementById("W").innerHTML = "W=" + W;
    resizeCanvas();
  });

class Box {
    constructor(x,y,size,text) {
        this.x = x
        this.y = y 
        this.size = size 
        this.text = text
        this.leftX = x
        this.leftY = y + ( size / 2 )
        this.rightX = x + size
        this.rightY = y + ( size / 2 )
    }
}

function drawBoxObject(obj) {
    // Begin path for the diamond
    ctx.beginPath();
    ctx.moveTo(obj.x, obj.y - obj.size);
    ctx.lineTo(obj.x + obj.size, obj.y);
    ctx.lineTo(obj.x, obj.y + obj.size);
    ctx.lineTo(obj.x - obj.size, obj.y);
    ctx.closePath();
  
    ctx.fillStyle = 'lightgreen';
    ctx.fill();
  
    ctx.strokeStyle = 'black';
    ctx.stroke();
  
    ctx.font = '14px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(obj.text, obj.x, obj.y);
  }

const box = new Box(50, 100, 30, 'OOP')
  drawSquareWithText(50, 100, 30, 'hello');
  drawDiamondWithText(150, 100, 30, 'dog');
  drawArrow(65, 115, 150, 100);
  

  drawBoxObject(box)