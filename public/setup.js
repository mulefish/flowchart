// ✅ **File 1: setup.js**

const TEXT_UP = -10;
const TEXT_OVER = 10;
const LINE_COLOR = "lightgray";
const FONT_SIZE = 10;
const CHARCOAL = "#e9e9e9";
const OUTLINE_COLOR = "#e9e9e9";
const ORANGE = "#ff5533";

let H = window.innerHeight * 0.1; 
let W = window.innerWidth; 


class Shape {
    constructor(x, y, size, text) {
        this.x = x; // Reference starting point (Box: top-left, Diamond: center)
        this.y = y; // Reference starting point (Box: top-left, Diamond: center)
        this.size = size; // Size (width/height for box, half-diameter for diamond)
        this.text = text;

        // Default center for boxes (rectangular shapes)
        this.centerX = x + (size / 2); 
        this.centerY = y + (size / 2);

        // Appearance
        this.type = undefined;
        this.backgroundColor = CHARCOAL;
        this.toggleColors = [CHARCOAL, ORANGE];
    }

    setShape(type) {
        this.type = type;
    }

    setToggleColors(color1, color2) {
        this.toggleColors = [color1, color2];
        this.backgroundColor = color1;
    }

    toggleBackgroundColor() {
        this.backgroundColor = (this.backgroundColor === this.toggleColors[0])
            ? this.toggleColors[1]
            : this.toggleColors[0];
        this.redraw();
    }

    redraw() {
        if (this.type === 'box') {
            drawBoxObject(this);
        } else if (this.type === 'diamond') {
            drawDiamondObject(this);
        }
    }
}

class TextObj extends Shape {
    constructor(x, y, size, text) {
        super(x, y, size, text);
        this.setShape("text");
        this.setToggleColors(CHARCOAL, ORANGE);
    }
}

class Diamond extends Shape {
    constructor(x, y, size, text) {
        super(x, y, size, text);
        this.setShape("diamond");
        this.setToggleColors(CHARCOAL, ORANGE);
        
        // Override centerX and centerY for Diamond
        this.centerX = x; // The center of a diamond is already `x`
        this.centerY = y; // The center of a diamond is already `y`
    }
}

class Box extends Shape {
    constructor(x, y, size, text) {
        super(x, y, size, text);
        this.setShape("box");
        this.setToggleColors(CHARCOAL, ORANGE);
    }
}

class Waypoint extends Shape {
    constructor(x, y, size, text) {
        super(x, y, size, text);
        this.setShape("waypoint");
        this.setToggleColors(CHARCOAL, ORANGE);
    }
}

function toggle(key) {
    nodes[key].toggleBackgroundColor();
}

/////////////// DISPLAY logic follows ///////////////
const svg = document.getElementById('mySVG');
function resizeSVG() {
    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', window.innerHeight * 0.2);
    H = window.innerHeight * 0.2;
    W = window.innerWidth;
    console.log("And now? " + H + " W " + W);
    document.getElementById("H").innerHTML = "H=" + H;
    document.getElementById("W").innerHTML = "W=" + W;
}

function getPosition(col, row, offsetX = 0, offsetY = 0) {
    if (typeof W === 'undefined' || typeof H === 'undefined') {
        console.error('W and H are undefined. Ensure resizeSVG() is called before setTheShapes.');
        return { x: 0, y: 0 };
    }
    return {
        x: col * (W / 12) + offsetX,
        y: row * (H / 6) + offsetY,
    };
}

function drawBoxObject(obj) {
    if (isNaN(obj.x) || isNaN(obj.y)) {
        console.error(`Invalid coordinates for object: x=${obj.x}, y=${obj.y}`);
        return;
    }
    let box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    box.setAttribute('x', obj.x);
    box.setAttribute('y', obj.y);
    box.setAttribute('width', obj.size);
    box.setAttribute('height', obj.size);
    box.setAttribute('fill', obj.backgroundColor || 'lightblue');
    box.setAttribute('stroke', OUTLINE_COLOR);

    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', TEXT_OVER + obj.x + obj.size / 2);
    text.setAttribute('y', TEXT_UP + obj.y + obj.size / 2);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('alignment-baseline', 'middle');
    text.setAttribute('font-size', FONT_SIZE);
    text.textContent = obj.text;

    svg.appendChild(box);
    svg.appendChild(text);
}

function drawDiamondObject(obj) {
    let diamond = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    diamond.setAttribute('points', `
        ${obj.x},${obj.y - obj.size}
        ${obj.x + obj.size},${obj.y}
        ${obj.x},${obj.y + obj.size}
        ${obj.x - obj.size},${obj.y}
    `);
    diamond.setAttribute('fill', obj.backgroundColor || 'lightgreen');
    diamond.setAttribute('stroke', OUTLINE_COLOR);

    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', obj.x);
    text.setAttribute('y', obj.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('alignment-baseline', 'middle');
    text.setAttribute('font-size', FONT_SIZE);
    text.textContent = obj.text;

    svg.appendChild(diamond);
    svg.appendChild(text);
}

function drawTextObject(obj) {
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', obj.x);
    text.setAttribute('y', obj.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('alignment-baseline', 'middle');
    text.setAttribute('font-size', FONT_SIZE);
    text.setAttribute('fill', ORANGE);
    text.textContent = obj.text;
    svg.appendChild(text);
}
/**
 * Calculate start and end coordinates for an arrow between two shapes.
 * @param {Shape} obj1 - Source shape.
 * @param {Shape} obj2 - Target shape.
 * @param {string} direction - "downUp", "leftRight", "upDown", "rightLeft", "center".
 * @returns {[number, number, number, number]} Coordinates (x1, y1, x2, y2).
 */
function getFromToXY(obj1, obj2, direction) {
    let x1, y1, x2, y2;

    switch (direction) {
        case 'downUp': {
            // From bottom of obj1 to top of obj2
            x1 = obj1.centerX;
            y1 = obj1.y + obj1.size; // Bottom edge
            x2 = obj2.centerX;
            y2 = obj2.y; // Top edge
            break;
        }
        case 'upDown': {
            // From top of obj1 to bottom of obj2
            x1 = obj1.centerX;
            y1 = obj1.y; // Top edge
            x2 = obj2.centerX;
            y2 = obj2.y + obj2.size; // Bottom edge
            break;
        }
        case 'leftRight': {
            // From right of obj1 to left of obj2
            x1 = obj1.x + obj1.size; // Right edge
            y1 = obj1.centerY;
            x2 = obj2.x; // Left edge
            y2 = obj2.centerY;
            break;
        }
        case 'rightLeft': {
            // From left of obj1 to right of obj2
            x1 = obj1.x; // Left edge
            y1 = obj1.centerY;
            x2 = obj2.x + obj2.size; // Right edge
            y2 = obj2.centerY;
            break;
        }
        case 'center': {
            // From center of obj1 to center of obj2
            x1 = obj1.centerX;
            y1 = obj1.centerY;
            x2 = obj2.centerX;
            y2 = obj2.centerY;
            break;
        }
        default: {
            console.error(`Invalid direction: ${direction}`);
            return [0, 0, 0, 0];
        }
    }

    return [x1, y1, x2, y2];
}

function drawArrow(obj1, obj2, direction, arrowType) {
    /* 
    Each Arrow is Unique:
    Each arrow has its own SVG <g> group.
    Prevents overwriting when multiple arrows originate from the same shape.
    */
    let [x1, y1, x2, y2] = getFromToXY(obj1, obj2, direction);
    
    const arrowLength = 5;
    const arrowAngle = Math.PI / 6;
    const angle = Math.atan2(y2 - y1, x2 - x1);

    // Create a group for the arrow (to avoid overwriting arrows)
    let arrowGroup = document.createElementNS("http://www.w3.org/2000/svg", "g"); // Important and tricksy!
    arrowGroup.setAttribute('class', 'arrow');
    arrowGroup.setAttribute('data-from', obj1.text);
    arrowGroup.setAttribute('data-to', obj2.text);

    // Create Line
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', LINE_COLOR);
    line.setAttribute('stroke-width', '1');
    if ( arrowType === dashed ) {
        line.setAttribute('stroke-dasharray', '5,5');
    }

    // Create Arrowhead
    let arrowPoint1 = {
        x: x2 - arrowLength * Math.cos(angle - arrowAngle),
        y: y2 - arrowLength * Math.sin(angle - arrowAngle)
    };
    let arrowPoint2 = {
        x: x2 - arrowLength * Math.cos(angle + arrowAngle),
        y: y2 - arrowLength * Math.sin(angle + arrowAngle)
    };

    let arrowHead = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    arrowHead.setAttribute('points', `
        ${x2},${y2}
        ${arrowPoint1.x},${arrowPoint1.y}
        ${arrowPoint2.x},${arrowPoint2.y}
    `);
    arrowHead.setAttribute('fill', 'gray'); // LINE_COLOR);

    // Append the line and arrowhead to the group
    arrowGroup.appendChild(line);
    arrowGroup.appendChild(arrowHead);

    // Append the group to the SVG
    svg.appendChild(arrowGroup);
}

