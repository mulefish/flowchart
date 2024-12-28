// ✅ **File 2: flowchart.js**

const leftRight = "leftRight";
const rightLeft = "rightLeft";
const downUp = "downUp";
const upDown = "upDown";
const solid = "solid";
const dashed = "dashed";

// Constants for grid spacing
let GRID_X = W / 12; // Divides width into 12 columns
let GRID_Y = H / 6;  // Divides height into 6 rows

/**
 * Calculate X and Y dynamically based on grid positions.
 * @param {number} col - Column index (horizontal position).
 * @param {number} row - Row index (vertical position).
 * @param {number} offsetX - Horizontal adjustment (optional).
 * @param {number} offsetY - Vertical adjustment (optional).
 * @returns {Object} { x, y }
 */
function getPosition(col, row, offsetX = 0, offsetY = 0) {
    return {
        x: col * GRID_X + offsetX,
        y: row * GRID_Y + offsetY,
    };
}

/**
 * Setup and draw nodes and connections
 */
function setTheShapes() {
    if (typeof W === 'undefined' || typeof H === 'undefined') {
        console.error('W and H are undefined. Ensure resizeSVG() is called before setTheShapes.');
        return;
    }
    nodes = {
        "Home": new Box(getPosition(1, 3).x, getPosition(1, 3).y, 20, 'Home'),
        "Disclosures": new Box(getPosition(4, 3).x, getPosition(4, 3).y, 20, 'Disclosures'),
        "SignIn": new Diamond(getPosition(6, 3).x, getPosition(6, 3).y, 10, 'SignIn'),
        "Password": new Box(getPosition(7, 1).x, getPosition(7, 1).y, 20, 'Password'),
        "No1": new TextObj(getPosition(6, 5).x, getPosition(6, 5).y, 0, 'No'),
        "SignUp": new Box(getPosition(3, 5).x, getPosition(3, 5).y, 20, 'SignUp'),
        "STA": new Box(getPosition(4, 5).x, getPosition(4, 5).y, 20, 'Setup'),
        "Snow": new Diamond(getPosition(5, 6).x, getPosition(5, 6).y, 10, 'Snow?'),
        "Yes1": new TextObj(getPosition(8, 6).x, getPosition(8, 6).y, 0, 'Yes'),
        "Associate": new Box(getPosition(9, 5).x, getPosition(9, 5).y, 20, 'Ass'),
        "MFA": new Box(getPosition(9, 3).x, getPosition(9, 3).y, 20, 'MFA'),
        "STALookup": new Diamond(getPosition(10, 3).x, getPosition(10, 3).y, 10, 'STA Lookup'),
        "Found": new TextObj(getPosition(11, 2).x, getPosition(11, 2).y, 0, 'Found'),
        "NotFound": new TextObj(getPosition(11, 5).x, getPosition(11, 5).y, 0, 'NotFound'),
    };

    // Draw the nodes

    for (let k in nodes) {
        const o = nodes[k];
        try {
            if (o.type === "diamond") {
                drawDiamondObject(o);
            } else if (o.type === "box") {
                drawBoxObject(o);
            } else if (o.type === "waypoint") {
                drawCircleObject(o);
            } else if (o.type === "text") {
                drawTextObject(o);
            }
        } catch (failbot) {
            console.log("BOOM " + failbot)
        }
    }

    // Define connections
    fromTo = [
        { from: "Home", target: "Disclosures", direction: leftRight, arrowType: solid },
        { from: "Disclosures", target: "SignIn", direction: leftRight, arrowType: solid },
        { from: "SignIn", target: "Password", direction: downUp, arrowType: solid },
        { from: "SignIn", target: "SignUp", direction: upDown, arrowType: dashed },
        { from: "SignUp", target: "STA", direction: leftRight, arrowType: solid },
        { from: "STA", target: "Snow", direction: leftRight, arrowType: solid },
        { from: "Snow", target: "No1", direction: leftRight, arrowType: solid },
        { from: "No1", target: "SignIn", direction: downUp, arrowType: solid },
        { from: "Snow", target: "Yes1", direction: rightLeft, arrowType: solid },
        { from: "Yes1", target: "Associate", direction: leftRight, arrowType: solid },
        { from: "SignIn", target: "MFA", direction: leftRight, arrowType: solid },
        { from: "MFA", target: "STALookup", direction: leftRight, arrowType: solid },
        { from: "STALookup", target: "Found", direction: upDown, arrowType: solid },
        { from: "STALookup", target: "NotFound", direction: downUp, arrowType: solid },
    ];

    // Draw arrows
    fromTo.forEach(({ from, target, direction, arrowType }) => {
        drawArrow(nodes[from], nodes[target], direction, arrowType);
    });
}
