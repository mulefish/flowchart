// ✅ **File 1: setup.js**

const TEXT_UP = -10;
const TEXT_OVER = 10;
const LINE_COLOR = "lightgray";
const FONT_SIZE = 12;
const CHARCOAL = "#e0e0e0";
const OUTLINE_COLOR = "#e9e9e9";
const ORANGE = "#ff5533";



class Shape {
    constructor(x, y, size, text, key) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.text = text;
        this.key = key;

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
    constructor(x, y, size, text, key) {
        super(x, y, size, text, key);
        const msg = { x, y, size, text }
        this.setShape("text");
        this.setToggleColors(CHARCOAL, ORANGE);
        this.centerX = x;
        this.centerY = y;
    }
}

class Diamond extends Shape {
    constructor(x, y, size, text, key) {
        super(x, y, size, text, key);
        this.setShape("diamond");
        this.setToggleColors(CHARCOAL, ORANGE);

        this.centerX = x;
        this.centerY = y;
    }
}

class Box extends Shape {
    constructor(x, y, size, text, key) {
        super(x, y, size, text, key);
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

// function drawBoxObject(obj) {
//     let box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
//     box.setAttribute('x', obj.x);
//     box.setAttribute('y', obj.y);
//     box.setAttribute('width', obj.size);
//     box.setAttribute('height', obj.size);
//     box.setAttribute('fill', obj.backgroundColor || 'lightblue');
//     box.setAttribute('stroke', OUTLINE_COLOR);

//     let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
//     text.setAttribute('x', TEXT_OVER + obj.x + obj.size / 2);
//     text.setAttribute('y', TEXT_UP + obj.y + obj.size / 2);
//     text.setAttribute('text-anchor', 'middle');
//     text.setAttribute('alignment-baseline', 'middle');
//     text.setAttribute('font-size', FONT_SIZE);
//     text.textContent = obj.text;
//     text.setAttribute('style', 'user-select: none;'); // Selectable text in a Viz is crazy; This stops that.
//     box.addEventListener('click', () => obj.toggleBackgroundColor());
//     text.addEventListener('click', () => obj.toggleBackgroundColor());

//     svg.appendChild(box);
//     svg.appendChild(text);
// }


function getHTMLLikeText(obj) {
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', TEXT_OVER + obj.x + obj.size / 2);
    text.setAttribute('y', TEXT_UP + obj.y + obj.size / 2);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('alignment-baseline', 'middle');
    text.setAttribute('font-size', FONT_SIZE);
    text.setAttribute('style', 'user-select: none;');

    // Handle multi-line text!
    let lines = obj.text.split('<br/>');
    lines.forEach((line, index) => {
        let tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan.setAttribute('x', TEXT_OVER + obj.x + obj.size / 2); // Align horizontally
        tspan.setAttribute('dy', index === 0 ? 0 : FONT_SIZE); // Offset subsequent lines
        tspan.textContent = line.trim();
        text.appendChild(tspan);
    });
    return text

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
    text.setAttribute('style', 'user-select: none;'); // Selectable text in a Viz is crazy; This stops that.

    svg.appendChild(text);
}

function drawBoxObject(obj) {
    let box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    box.setAttribute('x', obj.x);
    box.setAttribute('y', obj.y);
    box.setAttribute('width', obj.size);
    box.setAttribute('height', obj.size);
    box.setAttribute('fill', obj.backgroundColor || 'lightblue');
    box.setAttribute('stroke', OUTLINE_COLOR);
    const text = getHTMLLikeText(obj)
    // Add event listeners
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

    const text = getHTMLLikeText(obj)
    diamond.addEventListener('click', () => obj.toggleBackgroundColor());
    text.addEventListener('click', () => obj.toggleBackgroundColor());

    svg.appendChild(diamond);
    svg.appendChild(text);
}



function getFromToXY(obj1, obj2) {
    let x1 = obj1.centerX || obj1.x;
    let y1 = obj1.centerY || obj1.y;
    let x2 = obj2.centerX || obj2.x;
    let y2 = obj2.centerY || obj2.y;

    if ([x1, y1, x2, y2].some(coord => coord === undefined || isNaN(coord))) {
        console.error('Invalid coordinates passed to drawArrow:', { x1, y1, x2, y2 });
    }

    return [x1, y1, x2, y2];
}


// function drawArrow(obj1, obj2, isSolid, arrowType, mood) {

//     console.log("isSolid: " + isSolid + " arrowType: " + arrowType + " mood " + mood)

//     let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
//     line.setAttribute('x1', obj1.centerX);
//     line.setAttribute('y1', obj1.centerY);
//     line.setAttribute('x2', obj2.centerX);
//     line.setAttribute('y2', obj2.centerY);

//     let clr = CHARCOAL
//     let lineWidth = '1'
//     if (mood === positive) {
//         clr = "#00ff00"
//         //lineWidth = '2'
//     } else if (mood === negative) {
//         clr = "#ff0000"
//         //lineWidth = '2'
//     }

//     line.setAttribute('stroke', clr);
//     line.setAttribute('stroke-width', lineWidth);
//     if (isSolid === dashed) {
//         line.setAttribute('stroke-dasharray', '5,5');
//     }
//     svg.appendChild(line);

//     if (arrowType === hasArrow) {
//         const arrowLength = 4;
//         const arrowAngle = Math.PI / 6; // 30 degrees 
//         const angle = Math.atan2(obj2.centerY - obj1.centerY, obj2.centerX - obj1.centerX);

//         let arrowHead = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
//         arrowHead.setAttribute('points', `
//         ${obj2.centerX},${obj2.centerY}
//         ${obj2.centerX - arrowLength * Math.cos(angle - arrowAngle)},${obj2.centerY - arrowLength * Math.sin(angle - arrowAngle)}
//         ${obj2.centerX - arrowLength * Math.cos(angle + arrowAngle)},${obj2.centerY - arrowLength * Math.sin(angle + arrowAngle)}
//     `);

//         clr = 'darkgray' // ORANGE
//         if (mood === positive) {
//             clr = "#00ff00"
//         } else if (mood === negative) {
//             clr = "#ff0000"
//         }

//         arrowHead.setAttribute('fill', clr);
//         arrowHead.setAttribute('stroke', clr);

//         svg.appendChild(arrowHead);
//     }
// }

function drawArrow(obj1, obj2, isSolid, arrowType, mood) {
    console.log("isSolid: " + isSolid + " arrowType: " + arrowType + " mood " + mood);

    const OFFSET = 10; // Shorten start and end by 20 pixels

    // Calculate the angle of the line
    const angle = Math.atan2(obj2.centerY - obj1.centerY, obj2.centerX - obj1.centerX);

    // Shorten the start and end points
    const x1 = obj1.centerX + OFFSET * Math.cos(angle);
    const y1 = obj1.centerY + OFFSET * Math.sin(angle);
    const x2 = obj2.centerX - OFFSET * Math.cos(angle);
    const y2 = obj2.centerY - OFFSET * Math.sin(angle);

    // Create the line
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);

    let clr = CHARCOAL;
    let lineWidth = '1';
    if (mood === positive) {
        clr = "#00ff00";
    } else if (mood === negative) {
        clr = "#ff0000";
    }

    line.setAttribute('stroke', clr);
    line.setAttribute('stroke-width', lineWidth);

    if (isSolid === dashed) {
        line.setAttribute('stroke-dasharray', '5,5');
    }

    svg.appendChild(line);

    // Create the arrowhead
    if (arrowType === hasArrow) {
        const arrowLength = 4;
        const arrowAngle = Math.PI / 6; // 30 degrees

        let arrowHead = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        arrowHead.setAttribute('points', `
            ${x2},${y2}
            ${x2 - arrowLength * Math.cos(angle - arrowAngle)},${y2 - arrowLength * Math.sin(angle - arrowAngle)}
            ${x2 - arrowLength * Math.cos(angle + arrowAngle)},${y2 - arrowLength * Math.sin(angle + arrowAngle)}
        `);

        clr = 'darkgray';
        if (mood === positive) {
            clr = "#00ff00";
        } else if (mood === negative) {
            clr = "#ff0000";
        }

        arrowHead.setAttribute('fill', clr);
        arrowHead.setAttribute('stroke', clr);

        svg.appendChild(arrowHead);
    }
}
