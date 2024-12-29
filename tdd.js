const CHARCOAL = "#e9e9e9"
const ORANGE = "#ff6633";
class Shape {
    constructor( key, x, y, size, text) {
        this.key = key 
        this.x = x;
        this.y = y;
        this.size = size;
        this.text = text;
        this.type = undefined; // This is extended by the sub-classers  
        this.centerX = x + (size / 2);
        this.centerY = y + (size / 2);
        this.type = undefined;
        this.backgroundColor = CHARCOAL;
        this.toggleColors = [CHARCOAL, ORANGE];
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
        const msg = this.x + " " + this.y + " " + this.key + " " + this.type + " " + this.centerX + " " + this.centerY + " type=" + this.type 
        return msg
    }
}

class Text extends Shape {
    constructor(key, x, y, size, text) {
        super(key, x, y, size, text);
        this.type = "Text"
        this.setToggleColors(CHARCOAL, ORANGE);
    }
}

class Diamond extends Shape {
    constructor(key, x, y, size, text) {
        super(key, x, y, size, text);
        this.type = "Diamond"
        this.setToggleColors(CHARCOAL, ORANGE);
    }
}

class Box extends Shape {
    constructor(key, x, y, size, text) {
        super(key, x, y, size, text);
        this.type = "Box"
        this.setToggleColors(CHARCOAL, ORANGE);
    }
}

let objects = {
    'A': { x: 0, y: 0, type: "box", text: "hello1" },
    'B': { x: 0, y: 0, type: "box", text: "hello2" },
    'C': { x: 0, y: 0, type: "diamond", text: "hello3" },
    'D': { x: 0, y: 0, type: "text", text: "hello4" },
    'E': { x: 0, y: 0, type: "box", text: "hello5" },
    'F': { x: 0, y: 0, type: "box", text: "hello6" },
    'Z': { x: 0, y: 0, type: "text", text: "hell7o" }

};

const left = "left";
const up = "up";
const down = "down";
const right = "right";

let arrayOfObjects = [
    { from: "A", to: "B", x: 0, y: 0, direction: right },
    { from: "B", to: "Z", x: 0, y: 0, direction: up },
    { from: "Z", to: "C", x: 0, y: 0, direction: up },
    { from: "C", to: "D", x: 0, y: 0, direction: up },
];

const H = 200;
const W = 1000;
const STEP = 100;

function setXYWithForceDirectedGraph() {
    const nodeSpacing = W / (Object.keys(objects).length + 1);
    const connectedNodes = new Set();
    arrayOfObjects.forEach(edge => {
        connectedNodes.add(edge.from);
        connectedNodes.add(edge.to);
    });
    let index = 0;
    for (let key in objects) {
        if (connectedNodes.has(key)) {
            objects[key].x = (index + 1) * nodeSpacing;
            objects[key].y = H / 2;
            index++;
        }
    }
    arrayOfObjects.forEach(edge => {
        const fromNode = objects[edge.from];
        const toNode = objects[edge.to];

        switch (edge.direction) {
            case left:
                toNode.x = fromNode.x - STEP;
                toNode.y = fromNode.y;
                break;
            case right:
                toNode.x = fromNode.x + STEP;
                toNode.y = fromNode.y;
                break;
            case up:
                toNode.x = fromNode.x;
                toNode.y = fromNode.y - STEP;
                break;
            case down:
                toNode.x = fromNode.x;
                toNode.y = fromNode.y + STEP;
                break;
        }
        edge.x = (fromNode.x + toNode.x) / 2;
        edge.y = (fromNode.y + toNode.y) / 2;
    });
    normalizePositions();
}

function normalizePositions() {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    for (let key in objects) {
        if (objects[key].x !== 0 || objects[key].y !== 0) {
            minX = Math.min(minX, objects[key].x);
            maxX = Math.max(maxX, objects[key].x);
            minY = Math.min(minY, objects[key].y);
            maxY = Math.max(maxY, objects[key].y);
        }
    }
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    for (let key in objects) {
        if (objects[key].x !== 0 || objects[key].y !== 0) {
            objects[key].x = ((objects[key].x - minX) / rangeX) * W;
            objects[key].y = ((objects[key].y - minY) / rangeY) * H;
        }
    }
    arrayOfObjects.forEach(edge => {
        edge.x = ((edge.x - minX) / rangeX) * W;
        edge.y = ((edge.y - minY) / rangeY) * H;
    });
}

// Run the function
setXYWithForceDirectedGraph();


let nodes = {}

for (let key in objects) {
    let v = objects[key]
    const x = v.x
    const y = v.y
    const t = v.text
    if (v.type == "box") {
        nodes[key] = new Box(key, x, y, 30, t)
    } else if (v.type == "diamond") {
        nodes[key] = new Diamond(key, x, y, 20, t)
    } else if (v.type == "text") {
        nodes[key] = new Text(key, x, y, 20, t)
    }
    console.log(nodes[key].emit() )
}
for (let k in nodes) {
    const node = nodes[k]
    // console.log(node.emit())
}
