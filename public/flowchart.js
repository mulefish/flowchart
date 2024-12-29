// ✅ **File 2: flowchart.js**

const leftRight = "leftRight";
const rightLeft = "rightLeft";
const downUp = "downUp";
const upDown = "upDown";
const solid = "solid";
const dashed = "dashed";
let nodes = []

let GRID_X = VIEWPORT_WIDTH / 30;
let GRID_Y = VIEWPORT_HEIGHT / 10;

function getX(obj, col) {
    return col * GRID_X + obj.x
}
function getY(obj, row) {
    return row * GRID_Y + obj.y
}


function setTheShapes() {
    // Relative positioning! Not as clever as a general force directed graph with springs and gravity but way way simplier. 
    // And not hard coded! This relative stuff is a OK comprimise(sic) methinks. 
    //
    // NOTE: negative is UP!
    const refpoint = { x: 1 * GRID_X, y: 5 * GRID_Y }
    const home = new Box(getX(refpoint, 0), getY(refpoint, 0), 20, 'Home')
    const disclosures = new Box(getX(home, 1), getY(home, 0), 20, 'Disclosures')
    const signIn = new Diamond(getX(disclosures, 1.5), getY(disclosures, 0.5), 10, 'SignIn')
    const password = new Box(getX(signIn, 0), getY(signIn, -4), 10, 'Password')
    const signUp = new Box(getX(signIn, -1), getY(signIn, 2), 20, 'SignUp')
    const STA = new Box(getX(signUp, 1), getY(signUp, 0), 20, 'STA')
    const Snow = new Box(getX(STA, 1), getY(STA, 0), 20, 'Snow?')
    const _inbetween = {x:( Snow.x + signIn.x ) / 2, y:( Snow.y + signIn.y ) / 2}
    const No1 = new TextObj(getX(_inbetween, 0.2), getY(_inbetween,0), 0, 'No')
    const Yes1 = new TextObj(getX(Snow, 1), getY(Snow,0), 0, 'Yes')
    const Associate = new Box(getX(Yes1, 1), getY(Yes1, 0), 20, 'Associate')
    const STALookup = new Box(getX(Associate, 1), getY(Associate, 0), 20, 'STA Lookup')
    const Yes2 = new TextObj(getX(STALookup, 1), getY(STALookup,-1), 0, 'Yes')
    const No2 = new TextObj(getX(STALookup, 1), getY(STALookup,1), 0, 'No')
    const ActiveRenewal = new Box(getX(Yes2, 1), getY(Yes2, -1), 20, 'Active Renewal')
    const Found = new TextObj(getX(ActiveRenewal, 1), getY(ActiveRenewal,-2), 0, 'Found')
    const NotFound = new TextObj(getX(ActiveRenewal, 1), getY(ActiveRenewal,3), 0, 'Not Found')
    const Elegable = new Diamond(getX(Found, 1), getY(Found, -1), 20, 'Renewable?')
    const EndFlow = new Box(getX(Elegable, 1), getY(Elegable, -1), 20, 'End flow')

    nodes = {
        Home: home,
        Disclosures: disclosures,
        SignIn: signIn,
        Password: password,
        SignUp: signUp,
        STA: STA,
        Snow:Snow,
        No1: No1,
        Yes1: Yes1,
        Associate:Associate,
        STALookup:STALookup,
        Yes2:Yes2,
        No2:No2,
        ActiveRenewal:ActiveRenewal,
        NotFound:NotFound,
        Found:Found,
        Elegable:Elegable,
        EndFlow:EndFlow
    }

    for (let k in nodes) {
        const o = nodes[k];
        if (o.type === "diamond") {
            drawDiamondObject(o);
        } else if (o.type === "box") {
            drawBoxObject(o);
        } else if (o.type === "waypoint") {
            drawCircleObject(o);
        } else if (o.type === "text") {
            drawTextObject(o);
        }
    }

    // Define connections
    fromTo = [
        { from: "Home", target: "Disclosures", direction: leftRight, arrowType: solid },
        { from: "Disclosures", target: "SignIn", direction: leftRight, arrowType: solid },
        { from: "SignIn", target: "Password", direction: downUp, arrowType: solid },
        { from: "SignIn", target: "SignUp", direction: upDown, arrowType: dashed },
        { from: "SignUp", target: "STA", direction: upDown, arrowType: solid },
        { from: "STA", target: "Snow", direction: leftRight, arrowType: solid },
        { from: "Snow", target: "No1", direction: downUp, arrowType: solid },
        { from: "No1", target: "SignIn", direction: downUp, arrowType: solid },
        { from: "Snow", target: "Yes1", direction: leftRight, arrowType: solid },
        { from: "Yes1", target: "Associate", direction: leftRight, arrowType: solid },
        { from: "Associate", target: "STALookup", direction: leftRight, arrowType: solid },
        { from: "STALookup", target: "No2", direction: downUp, arrowType: solid },
        { from: "STALookup", target: "Yes2", direction: leftRight, arrowType: solid },
        { from: "Yes2", target: "ActiveRenewal", direction: leftRight, arrowType: solid },
        { from: "ActiveRenewal", target: "Found", direction: leftRight, arrowType: solid },
        { from: "ActiveRenewal", target: "NotFound", direction: leftRight, arrowType: solid },

        


        
    ]
    //     { from: "SignIn", target: "Password", direction: downUp, arrowType: solid },
    //     { from: "SignIn", target: "SignUp", direction: upDown, arrowType: dashed },
    //     { from: "SignUp", target: "STA", direction: leftRight, arrowType: solid },
    //     { from: "STA", target: "Snow", direction: leftRight, arrowType: solid },
    //     { from: "Snow", target: "No1", direction: leftRight, arrowType: solid },
    //     { from: "No1", target: "SignIn", direction: downUp, arrowType: solid },
    //     { from: "Snow", target: "Yes1", direction: rightLeft, arrowType: solid },
    //     { from: "Yes1", target: "Associate", direction: leftRight, arrowType: solid },
    //     { from: "SignIn", target: "MFA", direction: leftRight, arrowType: solid },
    //     { from: "MFA", target: "STALookup", direction: leftRight, arrowType: solid },
    //     { from: "STALookup", target: "Found", direction: upDown, arrowType: solid },
    //     { from: "STALookup", target: "NotFound", direction: downUp, arrowType: solid },
    // ];

    // Draw arrows
    fromTo.forEach(({ from, target, direction, arrowType }) => {
        drawArrow(nodes[from], nodes[target], direction, arrowType);
    });
}