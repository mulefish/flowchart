document.addEventListener("DOMContentLoaded", function () {
    const svg = document.querySelector('svg');
    const svgWidth = svg.clientWidth;
    const svgHeight = svg.clientHeight;

    // Utility function to create a box with state
    function createBox(x, y, width, height, textContent, id) {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svg.appendChild(group);

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", width);
        rect.setAttribute("height", height);
        rect.setAttribute("rx", 5);
        rect.setAttribute("ry", 5);
        rect.setAttribute("fill", "#e6f7ff"); // Default 'not done'
        rect.setAttribute("stroke", "#555");
        rect.setAttribute("stroke-width", 1.5);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x + width / 2);
        text.setAttribute("y", y + height / 2);
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "#000");
        text.setAttribute("font-size", "14px");
        text.textContent = textContent;

        group.appendChild(rect);
        group.appendChild(text);

        // State management
        let state = 'not done';

        group.addEventListener('click', () => {
            if (state === 'not done') {
                state = 'active';
                rect.setAttribute("fill", "#c6efce"); // Light green for 'active'
                console.log(`${textContent} is now active`);
            } else {
                state = 'not done';
                rect.setAttribute("fill", "#e6f7ff"); // Back to default color
                console.log(`${textContent} is now not done`);
            }
        });

        return group;
    }

    // Create 'HOME' box
    createBox(20, svgHeight / 2 - 25, 100, 50, "HOME", "home");

    // Create 'Disclosures' box
    createBox(300, svgHeight / 2 - 25, 120, 50, "Disclosures", "disclosures");

    // Draw an arrow from 'HOME' to 'Disclosures'
    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
    arrow.setAttribute("x1", 120); // Right edge of 'Home' box
    arrow.setAttribute("y1", svgHeight / 2);
    arrow.setAttribute("x2", 300); // Left edge of 'Disclosures' box
    arrow.setAttribute("y2", svgHeight / 2);
    arrow.setAttribute("stroke", "#555");
    arrow.setAttribute("stroke-width", 2);
    arrow.setAttribute("marker-end", "url(#arrowhead)");

    svg.appendChild(arrow);

    // Add marker (arrowhead) definition
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "arrowhead");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "7");
    marker.setAttribute("refX", "10");
    marker.setAttribute("refY", "3.5");
    marker.setAttribute("orient", "auto");

    const markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    markerPath.setAttribute("d", "M0,0 L10,3.5 L0,7 Z");
    markerPath.setAttribute("fill", "#555");

    marker.appendChild(markerPath);
    defs.appendChild(marker);
    svg.appendChild(defs);
});
