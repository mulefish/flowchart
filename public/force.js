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

// Draw the graph with mood-based link colors and group-based node colors
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw links with arrowheads
    for (const link of links) {
        ctx.setLineDash(link.mood === 'dashed' ? [5, 5] : []);
        ctx.strokeStyle = link.mood === 'positive' ? 'green' :
                          link.mood === 'negative' ? 'red' : 'gray';
        ctx.fillStyle = ctx.strokeStyle;

        ctx.lineWidth = 2;

        const shortened = shortenLine(
            link.source.x,
            link.source.y,
            link.target.x,
            link.target.y,
            20
        );

        ctx.beginPath();
        ctx.moveTo(shortened.x1, shortened.y1);
        ctx.lineTo(shortened.x2, shortened.y2);
        ctx.stroke();

        ctx.setLineDash([]);
        drawArrowhead(ctx, shortened.x1, shortened.y1, shortened.x2, shortened.y2);
    }

    // Draw nodes
    for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = node.selected ? 'yellow' :
                        node.group === 'biodata' ? 'pink' : 'lightgray';
        ctx.fill();
        ctx.strokeStyle = 'darkgray';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText(node.text, node.x, node.y);
    }
}

// Click-to-Toggle Node Color
canvas.addEventListener('click', (event) => {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    for (const node of nodes) {
        if (distance(node, { x: mouseX, y: mouseY }) < 15) {
            console.log(node)
            node.selected = !node.selected; // Toggle selection state
            break;
        }
    }
});

// Animation loop control
let animationId;
function tick() {
    updateSimulation();
    drawGraph();
    animationId = requestAnimationFrame(tick);
}

// Stop the animation and save the state
function stopAnimation() {
    console.log("Stopping animation...");
    cancelAnimationFrame(animationId); // Stop the animation loop

    // Serialize nodes and links into localStorage
    try {
        localStorage.setItem("nodes", JSON.stringify(nodes));
        localStorage.setItem("links", JSON.stringify(
            links.map(link => ({
                source: link.source.id,
                target: link.target.id,
                mood: link.mood
            }))
        ));
        console.log("State saved to localStorage.");
    } catch (error) {
        console.error("Error saving state to localStorage:", error);
    }
}

// Load the state and reset the animation
function loadState() {
    console.log("Loading state from localStorage...");
    try {
        const savedNodes = JSON.parse(localStorage.getItem("nodes"));
        const savedLinks = JSON.parse(localStorage.getItem("links"));

        if (savedNodes && savedLinks) {
            // Reconstruct nodes
            nodes = savedNodes.map(node => ({
                ...node,
                vx: 0, // Reset velocity
                vy: 0  // Reset velocity
            }));
            
            // Rebuild node map
            const nodeMap = {};
            nodes.forEach(node => {
                nodeMap[node.id] = node;
            });

            // Reconstruct links
            links = savedLinks.map(link => ({
                source: nodeMap[link.source],
                target: nodeMap[link.target],
                mood: link.mood
            }));

            console.log("State loaded successfully.");

            // Restart animation
            if (!animationId) {
                tick();
            }
        } else {
            console.warn("No valid saved state found in localStorage.");
        }
    } catch (error) {
        console.error("Error loading state from localStorage:", error);
    }
}


// Start Animation
tick();
