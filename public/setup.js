// ✅ **File 1: setup.js**

const TEXT_UP = -10;
const TEXT_OVER = 10;
const LINE_COLOR = "lightgray";
const FONT_SIZE = 12;
const CHARCOAL = "#e9e9e9";
const OUTLINE_COLOR = "#e9e9e9";
const ORANGE = "#ff5533";



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
    emit() {
        console.log("type=" + this.type + " x " + this.x + " y " + this.y)
    }
}
function yellow(obj) {
    console.log("%c" + JSON.stringify(obj), "background-color:yellow;")
}
class TextObj extends Shape {
    constructor(x, y, size, text) {
        super(x, y, size, text);
        const msg = { x, y, size, text }
        this.setShape("text");
        this.setToggleColors(CHARCOAL, ORANGE);
        this.centerX = x;
        this.centerY = y;
    }
}

class Diamond extends Shape {
    constructor(x, y, size, text) {
        super(x, y, size, text);
        this.setShape("diamond");
        this.setToggleColors(CHARCOAL, ORANGE);

        this.centerX = x;
        this.centerY = y;
    }
}

class Box extends Shape {
    constructor(x, y, size, text) {
        super(x, y, size, text);
        this.setShape("box");
        this.setToggleColors(CHARCOAL, ORANGE);
    }
}


/////////////// DISPLAY logic follows ///////////////
const svg = document.getElementById('mySVG');
function resizeSVG() { } // Maybe

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
    text.setAttribute('style', 'user-select: none;'); // Selectable text in a Viz is crazy; This stops that.
    box.addEventListener('click', () => obj.toggleBackgroundColor());
    text.addEventListener('click', () => obj.toggleBackgroundColor());

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
    text.setAttribute('style', 'user-select: none;'); // Selectable text in a Viz is crazy; This stops that.
    diamond.addEventListener('click', () => obj.toggleBackgroundColor());
    text.addEventListener('click', () => obj.toggleBackgroundColor());

    svg.appendChild(diamond);
    svg.appendChild(text);
}

function drawTextObject(obj) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', obj.x);
    text.setAttribute('y', obj.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('alignment-baseline', 'middle');
    text.setAttribute('font-size', FONT_SIZE);
    text.setAttribute('fill', ORANGE);
    text.textContent = obj.text;
    //text.setAttribute('style', 'user-select: none;'); // Selectable text in a Viz is crazy; This stops that.
    // box.addEventListener('click', () => obj.toggleBackgroundColor());
    // text.addEventListener('click', () => obj.toggleBackgroundColor());

    svg.appendChild(text);
}

function getFromToXY(obj1, obj2) {
    let x1, y1, x2, y2;
    x1 = obj1.centerX;
    y1 = obj1.centerY;
    x2 = obj2.centerX;
    y2 = obj2.centerY;
    return [x1, y1, x2, y2];

}

function drawArrow(obj1, obj2, arrowType, hasArrow) {
    /* 
    Each Arrow is Unique!
    Each arrow has its own SVG <g> group.
    Prevents overwriting when multiple arrows originate from the same shape.
    */
    let [x1, y1, x2, y2] = getFromToXY(obj1, obj2);

    const arrowLength = 6;
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
    if (arrowType === dashed) {
        line.setAttribute('stroke-dasharray', '5,5');
    }
    if (hasArrow !== noArrow) {
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
        arrowHead.setAttribute('fill', ORANGE);  // //'gray'); // LINE_COLOR);
        arrowGroup.appendChild(arrowHead);
    }
    arrowGroup.appendChild(line);

    svg.appendChild(arrowGroup);
}

