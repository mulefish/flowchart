// Create nodes and links
let nodes = [];
let links = [];

// Map names to nodes and distribute them horizontally across the canvas with random Y-axis
const nodeMap = {};
const totalNodes = Object.keys(names).length;

let index = 0;
for (const key in names) {
    const nodeData = names[key];
    nodeMap[key] = {
        id: key,
        text: nodeData.text,
        group: nodeData.group,
        shape: nodeData.shape || 'circle', // Default to circle if shape is not defined
        x: (index / (totalNodes - 1)) * (canvas.width - 100) + 50, // Even horizontal spacing
        y: Math.random() * (canvas.height - 50) + 25, // Random vertical position with margin
        vx: 0,
        vy: 0,
        selected: false // Track selection state
    };
    nodes.push(nodeMap[key]);
    index++;
}

// Create links based on children with mood
for (const key in names) {
    const parent = nodeMap[key];
    for (const child of names[key].children) {
        const childNode = nodeMap[child.id];
        if (childNode) {
            links.push({
                source: parent,
                target: childNode,
                mood: child.mood
            });
        }
    }
}

// Simulation Parameters
const SPRING_LENGTH = 150;
const SPRING_STRENGTH = 0.05;
const REPULSION_STRENGTH = 800;
const DAMPING = 0.8;

// Utility to calculate distance
function distance(node1, node2) {
    return Math.sqrt((node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2);
}

// Adjust points for shortening the lines
function shortenLine(x1, y1, x2, y2, offset) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    return {
        x1: x1 + offset * Math.cos(angle),
        y1: y1 + offset * Math.sin(angle),
        x2: x2 - offset * Math.cos(angle),
        y2: y2 - offset * Math.sin(angle)
    };
}

// Draw an arrowhead
function drawArrowhead(ctx, fromX, fromY, toX, toY) {
    const headLength = 10; // Arrowhead length
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
        toX - headLength * Math.cos(angle - Math.PI / 6),
        toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
        toX - headLength * Math.cos(angle + Math.PI / 6),
        toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
}

// Update simulation logic
function updateSimulation() {
    // Repulsion between nodes
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const nodeA = nodes[i];
            const nodeB = nodes[j];
            const dist = distance(nodeA, nodeB);
            if (dist === 0) continue;

            const force = REPULSION_STRENGTH / (dist * dist);
            const dx = nodeA.x - nodeB.x;
            const dy = nodeA.y - nodeB.y;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            nodeA.vx += fx;
            nodeA.vy += fy;
            nodeB.vx -= fx;
            nodeB.vy -= fy;
        }
    }

    // Spring forces
    for (const link of links) {
        const { source, target } = link;
        const dist = distance(source, target);
        const delta = dist - SPRING_LENGTH;
        const force = SPRING_STRENGTH * delta;
        const dx = target.x - source.x;
        const dy = target.y - source.y;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        source.vx += fx;
        source.vy += fy;
        target.vx -= fx;
        target.vy -= fy;
    }

    // Update positions and enforce boundaries
    for (const node of nodes) {
        node.vx *= DAMPING;
        node.vy *= DAMPING;

        node.x += node.vx;
        node.y += node.vy;

        node.x = Math.max(10, Math.min(canvas.width - 10, node.x));
        node.y = Math.max(10, Math.min(canvas.height - 10, node.y));
    }
}

// Draw nodes based on shape
function drawNode(ctx, node) {
    ctx.fillStyle = node.selected ? 'yellow' :
                    node.group === 'biodata' ? 'pink' : 'lightgray';
    ctx.strokeStyle = 'darkgray';

    switch (node.shape) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            break;
        case 'box':
            ctx.beginPath();
            ctx.rect(node.x - 15, node.y - 15, 30, 30);
            ctx.fill();
            ctx.stroke();
            break;
        case 'diamond':
            ctx.beginPath();
            ctx.moveTo(node.x, node.y - 15);
            ctx.lineTo(node.x + 15, node.y);
            ctx.lineTo(node.x, node.y + 15);
            ctx.lineTo(node.x - 15, node.y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        default:
            console.warn(`Unknown shape: ${node.shape}`);
    }

    // Draw node text
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.text, node.x, node.y);
}

// Draw the graph
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw links
    for (const link of links) {
        ctx.strokeStyle = link.mood === 'positive' ? 'green' :
                          link.mood === 'negative' ? 'red' : 'gray';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(link.source.x, link.source.y);
        ctx.lineTo(link.target.x, link.target.y);
        ctx.stroke();

        drawArrowhead(ctx, link.source.x, link.source.y, link.target.x, link.target.y);
    }

    // Draw nodes
    for (const node of nodes) {
        drawNode(ctx, node);
    }
}

// Toggle node color on click
canvas.addEventListener('click', (event) => {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    for (const node of nodes) {
        if (distance(node, { x: mouseX, y: mouseY }) < 15) {
            node.selected = !node.selected;
            break;
        }
    }
});

// Animation loop
let animationId;
function tick() {wd
    updateSimulation();
    drawGraph();
    animationId = requestAnimationFrame(tick);
}

// Start animation
tick();
