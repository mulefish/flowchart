// ✅ **File 2: flowchart.js**

const leftRight = "leftRight";
const rightLeft = "rightLeft";
const downUp = "downUp";
const upDown = "upDown";
const solid = "solid";
const dashed = "dashed";
const noArrow = "noArrow"
const hasArrow = "hasArrow"
const boxType = "box"
const diamondType = "diamond"
const positive = "positive"
const negative = "negative"
const neutral = "neutral"
let nodes = {}
let fromTo = {} 

let GRID_X = VIEWPORT_WIDTH / 30;
let GRID_Y = VIEWPORT_HEIGHT / 6;

function getX(obj, col) {
    return (GRID_X * col) + obj.x
}
function getY(obj, row) {
    return (GRID_Y * row) + obj.y
}

function getInbetween(obj1, obj2) {
    return { x: (obj1.x + obj2.x) / 2, y: (obj1.y + obj2.y) / 2 }
}

function addNode(x, y, size, parent, type, lineType, arrowType, mood, key, text ) {
    let obj = undefined
    if ( type === boxType ) {
        obj = new Box(x,y,size,text, key)
    } else {
        obj = new Diamond(x,y,size,text, key)
    }
    if ( parent.key !== undefined) {
        const child = {key:key, type:lineType, arrowType:arrowType, mood:mood}
        if ( ! fromTo.hasOwnProperty(parent.key)) {
            fromTo[parent.key] = []
        }
        fromTo[parent.key].push(child)
    }
    nodes[key] = obj    
    return obj
} 


function setTheShapes() {
    const z = { x: 1 * GRID_X, y: 3 * GRID_Y }

    const a = addNode(getX(z, 1), getY(z, 0), 20, z, boxType,  solid, hasArrow, neutral, "Home", "Home") 
    const b = addNode(getX(a, 1), getY(a, 0), 20, a, boxType,  solid, hasArrow,  neutral, "Disclosures", "Disclosures") 
    const c = addNode(getX(b, 1), getY(b, 0), 20, b, boxType,  solid, hasArrow,  neutral, "SignIn", "Sign<br/>in") 
    const d = addNode(getX(b, 0), getY(b, -2), 20, b, boxType,  solid, hasArrow,  neutral, "Password", "Password<br/>reset") 
    const e = addNode(getX(c, 1), getY(c, 0), 20, c, boxType,  solid, hasArrow,  neutral, "MFA", "MFA") 
    // 
    const f = addNode(getX(c, -2), getY(c, 2), 20, c, boxType,  dashed, hasArrow,  neutral, "Signup", "Sign<br/>up") 
    const g = addNode(getX(f, 1), getY(f, 0), 20, f, boxType,  solid, hasArrow,  neutral, "Account", "Account<br/>details") 
    const h = addNode(getX(g, 1), getY(g, 0), 10, g, diamondType,  solid, hasArrow,  neutral, "Snow", "Is in<br/>snow") 
    const i = addNode(getX(h, 1), getY(h, 0), 20, h, boxType,  solid, hasArrow,  positive, "Associate", "Associate<br/>account") 
    fromTo[h.key].push({key: c.key, type: 'solid', arrowType: 'hasArrow', mood: negative})
    // 
    const j = addNode(getX(e, 1), getY(e, 0), 10, e, diamondType,  solid, hasArrow,  neutral, "STA", "STA<br/>lookup") 
    const k = addNode(getX(j, 1), getY(j, -1), 10, j, boxType,  solid, hasArrow,  positive, "SnowRenew", "Renew<br/>Snow") 
    const l = addNode(getX(j, 1), getY(j, 1), 10, j, diamondType,  solid, hasArrow,  negative, "SnowActive", "Snow<br/>active<br/>enrollment") 




    // // Draw the shapes!
    for (let k in nodes) {
        const o = nodes[k];
        if (o.type === "diamond") {
            drawDiamondObject(o);
        } else if (o.type === "box") {
            drawBoxObject(o);
        }
    }

    for ( let key in fromTo ) {
        const ary = fromTo[key]
        for ( let i = 0 ; i < ary.length; i++) {
            const entry = ary[i] 
            const from = nodes[key]
            const to = nodes[entry.key]

            const lineType = entry.type 
            const arrowType = entry.arrowType
            const mood = entry.mood

            drawArrow(from, to, lineType, arrowType, mood);
        }
    } 
    console.log( fromTo )
}