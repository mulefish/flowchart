// Create nodes and links
const nodes = [];
const links = [];

// Map names to nodes
const nodeMap = {};
for (const key in names) {
    const nodeData = names[key];
    nodeMap[key] = {
        id: key,
        text: nodeData.text,
        group: nodeData.group, // Ensure group is included
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0
    };
    nodes.push(nodeMap[key]);
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
                mood: child.mood // Ensure mood is passed along
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

// Draw the graph with mood-based link colors and group-based node colors
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw links with mood-based colors
    for (const link of links) {
        switch (link.mood) {
            case positive:
                ctx.strokeStyle = 'green';
                break;
            case negative:
                ctx.strokeStyle = 'red';
                break;
            default:
                ctx.strokeStyle = 'gray';
        }
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(link.source.x, link.source.y);
        ctx.lineTo(link.target.x, link.target.y);
        ctx.stroke();
    }

    // Draw nodes with group-based background colors
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '12px Arial';

    for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
        console.log("group " + node.group )
        // Group-based colors 
        switch (node.group) {
            case 'biodata':
                ctx.fillStyle = 'pink';
                break;
            default:
                ctx.fillStyle = 'lightgray';
        }

        ctx.fill();
        ctx.strokeStyle = 'darkgray';
        ctx.stroke();

        // Draw node text
        ctx.fillStyle = 'black';
        ctx.fillText(node.text, node.x, node.y);
    }
}

// Animation loop control
let animationId;
function tick() {
    updateSimulation();
    drawGraph();
    animationId = requestAnimationFrame(tick);
}

// Stop animation
document.getElementById('stopButton').addEventListener('click', () => {
    cancelAnimationFrame(animationId);
});

tick();

// Dragging functionality
let draggedNode = null;

canvas.addEventListener('mousedown', (event) => {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    for (const node of nodes) {
        const dist = distance(node, { x: mouseX, y: mouseY });
        if (dist < 15) {
            draggedNode = node;
            break;
        }
    }
});

canvas.addEventListener('mousemove', (event) => {
    if (draggedNode) {
        draggedNode.x = event.offsetX;
        draggedNode.y = event.offsetY;
        draggedNode.vx = 0;
        draggedNode.vy = 0;
    }
});

canvas.addEventListener('mouseup', () => {
    draggedNode = null;
});
