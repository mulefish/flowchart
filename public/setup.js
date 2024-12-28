const TEXT_UP = -20
const TEXT_OVER = 20
let H = undefined
let W = undefined
class Shape {
    constructor(x, y, size, text) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.text = text;
        this.leftX = x;
        this.leftY = y + (size / 2);
        this.rightX = x + size;
        this.rightY = y + (size / 2);
        this.topX = x + (size / 2);
        this.topY = y;
        this.bottomX = x + (size / 2);
        this.bottomY = y + size;
        this.type = undefined;
        this.backgroundColor = 'lightgray';
        this.toggleColors = ['lightgray', 'yellow'];
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

class Diamond extends Shape {
    constructor(x, y, size, text) {
        super(x, y, size, text);
        this.setShape("diamond");
        this.setToggleColors('lightgreen', 'lightpink');
    }
}

class Box extends Shape {
    constructor(x, y, size, text) {
        super(x, y, size, text);
        this.setShape("box");
        this.setToggleColors('lightblue', 'lightcoral');
    }
}

function toggle(key) {
    nodes[key].toggleBackgroundColor()
}
/////////////// DISPLAY logic follows ///////////////
const svg = document.getElementById('mySVG');
function resizeSVG() {
    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', window.innerHeight * 0.2);
    H = window.innerHeight * 0.2;
    W = window.innerWidth;
    console.log("And now? " + H + " W " + W)
    document.getElementById("H").innerHTML = "H=" + H;
    document.getElementById("W").innerHTML = "W=" + W;
}

function drawBoxObject(obj) {
    let box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    box.setAttribute('x', obj.x);
    box.setAttribute('y', obj.y);
    box.setAttribute('width', obj.size);
    box.setAttribute('height', obj.size);
    box.setAttribute('fill', obj.backgroundColor || 'lightblue');
    box.setAttribute('stroke', 'black');

    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', TEXT_OVER + obj.x + obj.size / 2);
    text.setAttribute('y', TEXT_UP + obj.y + obj.size / 2);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('alignment-baseline', 'middle');
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
    diamond.setAttribute('stroke', 'black');

    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', TEXT_OVER + obj.x);
    text.setAttribute('y', TEXT_UP + obj.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('alignment-baseline', 'middle');
    text.textContent = obj.text;

    svg.appendChild(diamond);
    svg.appendChild(text);
}

function getFromToXY(obj1, obj2, direction) {
    let x1, y1, x2, y2;

    if (direction === downUp) {
        if (obj1.type === "diamond") {
            x1 = obj1.x; 
            y1 = obj1.y - obj1.size;
        } else {
            x1 = obj1.x + obj1.size / 2;
            y1 = obj1.y;
        }
        if (obj2.type === "diamond") {
            x2 = obj2.x; 
            y2 = obj2.y + obj2.size;
        } else {
            x2 = obj2.x + obj2.size / 2;
            y2 = obj2.y + obj2.size;
        }
    } else if (direction === leftRight) {
        if (obj1.type === "diamond") {
            x1 = obj1.x + obj1.size;
            y1 = obj1.y;
        } else {
            x1 = obj1.rightX;
            y1 = obj1.rightY;
        }

        if (obj2.type === "diamond") {
            x2 = obj2.x - obj2.size;
            y2 = obj2.y;
        } else {
            x2 = obj2.leftX;
            y2 = obj2.leftY;
        }
    } else {
        console.error(`Invalid direction: ${direction}`);
        return [0, 0, 0, 0];
    }

    return [x1, y1, x2, y2];
}



/**
 * Draw an arrow between two shapes
 * @param {Shape} obj1 - Source shape.
 * @param {Shape} obj2 - Target shape.
 * @param {string} direction - "downUp" or "leftRight"
 */
function drawArrow(obj1, obj2, direction) {
    /* 
    Each Arrow is Unique:
    Each arrow has its own SVG <g> group.
    Prevents overwriting when multiple arrows originate from the same shape.
    */
    let [x1, y1, x2, y2] = getFromToXY(obj1, obj2, direction);
    
    console.log("x1:", x1, "y1:", y1, "x2:", x2, "y2:", y2, "Direction:", direction);

    const arrowLength = 10;
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
    line.setAttribute('stroke', 'gray');
    line.setAttribute('stroke-width', '2');

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
    arrowHead.setAttribute('fill', 'gray');

    // Append the line and arrowhead to the group
    arrowGroup.appendChild(line);
    arrowGroup.appendChild(arrowHead);

    // Append the group to the SVG
    svg.appendChild(arrowGroup);
}



// Init and onresize called from index.html