const leftRight = "leftRight"
const rightLeft = "rightLeft"
const downUp = "downUp"
const upDown = "upDown"
const solid = "solid"
const dashed = "dashed"

let nodes = {}
let fromTo = []
function getY(down) {
    down /= 20
    return H *down
}

function getX(over) {
    over /= 20 
    return W * over 
}

function setTheShapes() {
    nodes = {
        "Home": new Box             (getX(1), getY(10), 20, 'Home'),
        "Disclosures": new Box      (getX(4), getY(10), 20, 'Disclosures'),
        "SignIn": new Diamond       (getX(6), getY(10), 10, 'SignIn'),
        "Password": new Box         (getX(7), getY(3), 20, 'Password'),
        "No1": new TextObj   (getX(6), getY(16), 0, 'No'),
        "SignUp": new Box           (getX(3), getY(16), 20, 'SignUp'),
        "STA": new Box              (getX(4), getY(16), 20, 'Setup'),
        "Snow": new Diamond       (getX(5), getY(18), 10, 'Snow?'),
        "Yes1": new TextObj   (getX(8), getY(17), 0, 'Yes'),
        "Associate": new Box      (getX(9), getY(16), 20, 'Associate'),
        "MFA": new Box      (getX(9), getY(10), 20, 'MFA'),
        "STALookup": new Diamond      (getX(10), getY(10), 10, 'STA Lookup'),
        "Found": new TextObj   (getX(11), getY(5), 0, 'Found'),
        "NotFound": new TextObj   (getX(11), getY(17), 0, 'NotFound'),
 
    };

    for (let k in nodes) {
        const o = nodes[k];
        if (o.type === "diamond") {
            drawDiamondObject(o);
        } else if (o.type === "box") {
            drawBoxObject(o);
        } else if ( o.type === "waypoint") {
            drawCircleObject(o)
        } else if ( o.type === "text") {
            drawText(o)
        } else {
            console.log("%c FAILBOT! ", "background-color:pink;");
        }
    }

    fromTo = [
        {from:"Home", target: "Disclosures", direction: leftRight, arrowType:solid },
        {from:"Disclosures", target: "SignIn", direction: leftRight , arrowType:solid},
        { from:"SignIn", target: "Password", direction: downUp , arrowType:solid},
        { from:"SignIn", target: "SignUp", direction: upDown , arrowType:dashed},
        { from:"SignUp", target: "STA", direction: leftRight , arrowType:solid},
        { from:"STA", target: "Snow", direction: leftRight , arrowType:solid},
        { from:"Snow", target: "No1", direction: leftRight , arrowType:solid},
        { from:"No1", target: "SignIn", direction: downUp , arrowType:solid},
        { from:"Snow", target: "Yes1", direction: rightLeft , arrowType:solid},
        { from:"Yes1", target: "Associate", direction: leftRight , arrowType:solid},
        { from:"SignIn", target: "MFA", direction: leftRight , arrowType:solid},
        { from:"MFA", target: "STALookup", direction: leftRight , arrowType:solid},
        { from:"STALookup", target: "Found", direction: upDown , arrowType:solid},
        { from:"STALookup", target: "NotFound", direction: downUp , arrowType:solid},
        

    ];

    fromTo.forEach((obj)=> {
        const f = obj.from 
        const t = obj.target         
        const from = nodes[f];
        const to = nodes[t];
        drawArrow(from, to, obj.direction, obj.arrowType);
    });
}
