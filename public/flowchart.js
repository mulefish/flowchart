// ✅ Step 1: Define Constants
const STEP = 100;
const SPRING_LENGTH = 150;
const SPRING_STRENGTH = 0.05;
const REPULSION_STRENGTH = 1000;
const ITERATIONS = 50;
const CHARCOAL = "#e9e9e9"; 
const ORANGE = "#ff6633";

// Node Shapes
class Shape {
    constructor(key, x, y, size, text) {
        this.key = key;
        this.x = x;
        this.y = y;
        this.size = size;
        this.text = text;
        this.type = undefined;
        this.centerX = x + (size / 2);
        this.centerY = y + (size / 2);
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
}

class Text extends Shape {
    constructor(key, x, y, size, text) {
        super(key, x, y, size, text);
        this.type = "Text";
    }
}

class Diamond extends Shape {
    constructor(key, x, y, size, text) {
        super(key, x, y, size, text);
        this.type = "Diamond";
    }
}

class Box extends Shape {
    constructor(key, x, y, size, text) {
        super(key, x, y, size, text);
        this.type = "Box";
    }
}



// ✅ Step 2: Declare `objects` and `arrayOfObjects`
let objects = {
    'A': { type: "box", text: "hello1" },
    'B': { type: "box", text: "hello2" },
    'C': { type: "diamond", text: "hello3" },
    'D': { type: "text", text: "hello4" },
    'E': { x: 0, y: 0, type: "box", text: "hello5" },
    'F': { x: 0, y: 0, type: "box", text: "hello6" },
    'Z': { x: 0, y: 0, type: "text", text: "hello7" }
};

let arrayOfObjects = [
    { from: "A", to: "B", x: 0, y: 0, direction: "right" },
    { from: "B", to: "Z", x: 0, y: 0, direction: "up" },
    { from: "Z", to: "C", x: 0, y: 0, direction: "up" },
    { from: "C", to: "D", x: 0, y: 0, direction: "up" }
];

// ✅ Step 3: Set Node Positions
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

    // Apply Attractive and Repulsive Forces
    applyForces();

    // Normalize Final Positions
    normalizePositions();
}

// ✅ Step 4: Apply Forces
function applyForces() {
    for (let i = 0; i < ITERATIONS; i++) {
        // Attractive Forces
        arrayOfObjects.forEach(edge => {
            const fromNode = objects[edge.from];
            const toNode = objects[edge.to];
            const dx = toNode.x - fromNode.x;
            const dy = toNode.y - fromNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
            const force = (distance - SPRING_LENGTH) * SPRING_STRENGTH;

            const fx = (force * dx) / distance;
            const fy = (force * dy) / distance;

            fromNode.x += fx;
            fromNode.y += fy;
            toNode.x -= fx;
            toNode.y -= fy;
        });

        // Repulsive Forces
        for (let keyA in objects) {
            for (let keyB in objects) {
                if (keyA === keyB) continue;
                const nodeA = objects[keyA];
                const nodeB = objects[keyB];
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;

                if (distance < SPRING_LENGTH) {
                    const force = (REPULSION_STRENGTH / (distance * distance)) * 0.1;

                    const fx = (force * dx) / distance;
                    const fy = (force * dy) / distance;

                    nodeA.x -= fx;
                    nodeA.y -= fy;
                    nodeB.x += fx;
                    nodeB.y += fy;
                }
            }
        }
    }
}

// ✅ Step 5: Normalize Node Positions
function normalizePositions() {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (let key in objects) {
        minX = Math.min(minX, objects[key].x);
        maxX = Math.max(maxX, objects[key].x);
        minY = Math.min(minY, objects[key].y);
        maxY = Math.max(maxY, objects[key].y);
    }

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    for (let key in objects) {
        objects[key].x = ((objects[key].x - minX) / rangeX) * W;
        objects[key].y = ((objects[key].y - minY) / rangeY) * (H - 40) + 20;
    }
}

// ✅ Step 6: Populate the Nodes Collection
let nodes = {};

setXYWithForceDirectedGraph();

for (let key in objects) {
    let v = objects[key];
    const x = v.x;
    const y = v.y;
    const t = v.text;

    if (x > 0 || y > 0) {
        if (v.type === "box") {
            nodes[key] = new Box(key, x, y, 30, t);
        } else if (v.type === "diamond") {
            nodes[key] = new Diamond(key, x, y, 20, t);
        } else if (v.type === "text") {
            nodes[key] = new Text(key, x, y, 20, t);
        }
    } else {
        console.log(`Skipping unconnected node: ${key}`);
    }
}

// ✅ Step 7: Render Nodes
for (let k in nodes) {
    if (nodes[k].type === "Diamond") {
        drawDiamondObject(nodes[k]);
    } else if (nodes[k].type === "Box") {
        drawBoxObject(nodes[k]);
    } else if (nodes[k].type === "Text") {
        drawTextObject(nodes[k]);
    }
}
