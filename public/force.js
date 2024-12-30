let draggedNode = null; // Track the currently dragged node

// Mouse event handlers
canvas.addEventListener('mousedown', (event) => {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    for (const node of nodes) {
        if (distance(node, { x: mouseX, y: mouseY }) < 15) {
            draggedNode = node; // Start dragging this node
            node.vx = 0; // Stop any existing velocity
            node.vy = 0;
            break;
        }
    }
});

canvas.addEventListener('mousemove', (event) => {
    if (draggedNode) {
        // Update node position to follow mouse
        draggedNode.x = event.offsetX;
        draggedNode.y = event.offsetY;
    }
});

canvas.addEventListener('mouseup', () => {
    if (draggedNode) {
        draggedNode = null; // Stop dragging
    }
});

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

            if (nodeA !== draggedNode) {
                nodeA.vx += fx;
                nodeA.vy += fy;
            }
            if (nodeB !== draggedNode) {
                nodeB.vx -= fx;
                nodeB.vy -= fy;
            }
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

        if (source !== draggedNode) {
            source.vx += fx;
            source.vy += fy;
        }
        if (target !== draggedNode) {
            target.vx -= fx;
            target.vy -= fy;
        }
    }

    // Update positions and enforce boundaries
    for (const node of nodes) {
        if (node !== draggedNode) { // Skip dragged node
            node.vx *= DAMPING;
            node.vy *= DAMPING;

            node.x += node.vx;
            node.y += node.vy;

            node.x = Math.max(10, Math.min(canvas.width - 10, node.x));
            node.y = Math.max(10, Math.min(canvas.height - 10, node.y));
        }
    }
}

/////////
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

// Draw an arrowhead with specified color
function drawArrowhead(ctx, fromX, fromY, toX, toY, color) {
    const headLength = 10; // Arrowhead length
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.fillStyle = color; // Arrowhead inherits line color
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

    let clr = "lightgray"
    if ( node.selected ) {
        clr = "yellow"
    } else if ( node.group === 'biodata') {
        clr = "pink"
    } else if ( node.group === "docselection") {

    } else if ( node.group === "scheduler") {

    } else if ( node.group === "payment") {

    } else if ( node.group === "terminal") {
        clr = "lightgreen"
    }

    ctx.fillStyle = clr
    ctx.strokeStyle = 'lightgray';

    switch (node.shape) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(node.x, node.y, 1, 0, 2 * Math.PI);
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
    ctx.font = '16px Arial'; 
    ctx.fillText(node.text, node.x, node.y);
}

// // Draw the graph
// function drawGraph() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw links
//     for (const link of links) {
//         const shortened = shortenLine(
//             link.source.x,
//             link.source.y,
//             link.target.x,
//             link.target.y,
//             20
//         );

//         const color = link.mood === 'positive' ? 'green' :
//                       link.mood === 'negative' ? 'red' : 'gray';

//         ctx.strokeStyle = color;
//         ctx.lineWidth = 2;

//         ctx.beginPath();
//         ctx.moveTo(shortened.x1, shortened.y1);
//         ctx.lineTo(shortened.x2, shortened.y2);
//         ctx.stroke();

//         drawArrowhead(ctx, shortened.x1, shortened.y1, shortened.x2, shortened.y2, color);
//     }

//     // Draw nodes
//     for (const node of nodes) {
//         drawNode(ctx, node);
//     }
// }
// Draw the graph
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw links
    for (const link of links) {
        const shortened = shortenLine(
            link.source.x,
            link.source.y,
            link.target.x,
            link.target.y,
            20
        );

        const color = link.mood === 'positive' ? 'green' :
                      link.mood === 'negative' ? 'red' :
                      link.mood === 'dashed' ? 'gray' : 'gray';

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        // Apply dashed style if mood is 'dashed'
        if (link.mood === 'dashed') {
            ctx.setLineDash([5, 5]); // Dashed line style
        } else {
            ctx.setLineDash([]); // Reset to solid line
        }

        // Draw the link
        ctx.beginPath();
        ctx.moveTo(shortened.x1, shortened.y1);
        ctx.lineTo(shortened.x2, shortened.y2);
        ctx.stroke();

        // Reset to solid lines for arrowheads
        ctx.setLineDash([]);
        drawArrowhead(ctx, shortened.x1, shortened.y1, shortened.x2, shortened.y2, color);
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
function tick() {
    updateSimulation();
    drawGraph();
    animationId = requestAnimationFrame(tick);
}

// Stop the animation and save the state
function stopAnimation() {
    console.log("stop animation");
    cancelAnimationFrame(animationId); // Stop the animation loop
    
    // Serialize nodes and links into localStorage
    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("links", JSON.stringify(
        links.map(link => ({
            source: link.source.id,
            target: link.target.id,
            mood: link.mood
        }))
    ));
    
    console.log("State saved to localStorage.");
}

// Load the state and reset the animation
function loadState() {
    console.log("loadState");
    const savedNodes = JSON.parse(localStorage.getItem("nodes"));
    const savedLinks = JSON.parse(localStorage.getItem("links"));

    if (savedNodes && savedLinks) {
        // Restore nodes
        nodes = savedNodes.map(node => ({
            ...node,
            vx: 0, // Reset velocity
            vy: 0  // Reset velocity
        }));
        
        // Create a mapping of node IDs to node objects
        const nodeMap = {};
        nodes.forEach(node => {
            nodeMap[node.id] = node;
        });

        // Restore links with correct references to node objects
        links = savedLinks.map(link => ({
            source: nodeMap[link.source],
            target: nodeMap[link.target],
            mood: link.mood
        }));
        
        console.log("State loaded from localStorage.");
        
        // Restart the animation if stopped
        if (!animationId) {
            tick();
        }
    } else {
        console.warn("No saved state found in localStorage.");
    }
}
tick();

