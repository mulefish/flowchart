// ✅ **File 2: flowchart.js**

const leftRight = "leftRight";
const rightLeft = "rightLeft";
const downUp = "downUp";
const upDown = "upDown";
const solid = "solid";
const dashed = "dashed";
const noArrow = "noArrow"
const hasArrow = "hasArrow" // Not used
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
    const Home = new Box(getX(refpoint, 0), getY(refpoint, 0), 20, 'Home')
    const Disclosures = new Box(getX(Home, 1), getY(Home, 0), 20, 'Disclosures')
    const signIn = new Diamond(getX(Disclosures, 1.5), getY(Disclosures, 0.5), 10, 'SignIn')
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
    const Yes3 = new TextObj(getX(Elegable, 0.5), getY(Elegable,3), 0, 'Yes')
    const No3 = new TextObj(getX(Elegable, 1), getY(Elegable,0), 0, 'No')
    const PromptForRenewal = new Diamond(getX(Yes3, 1.2), getY(Disclosures, 0), 10, 'Prompt For Renewal')
    const EndFlow = new Box(getX(No3, 1), getY(No3, -1), 20, 'End flow')


    nodes = {
        Home,
        Disclosures,
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
        EndFlow:EndFlow,
        Yes3,
        No3,
        PromptForRenewal
    }



    // Define edges
    fromTo = [
        { from: "Home", target: "Disclosures", arrowType: solid },
        { from: "Disclosures", target: "SignIn", arrowType: solid },
        { from: "SignIn", target: "Password", arrowType: solid },
        { from: "SignIn", target: "SignUp", arrowType: dashed },
        { from: "SignUp", target: "STA", arrowType: solid },
        { from: "STA", target: "Snow", arrowType: solid },
        { from: "Snow", target: "No1", arrowType: solid },
        { from: "No1", target: "SignIn", arrowType: solid },
        { from: "Snow", target: "Yes1", arrowType: solid },
        { from: "Yes1", target: "Associate", arrowType: solid },
        { from: "Associate", target: "STALookup", arrowType: solid },
        { from: "STALookup", target: "No2", arrowType: solid },
        { from: "STALookup", target: "Yes2", arrowType: solid },
        { from: "Yes2", target: "ActiveRenewal", arrowType: solid },
        { from: "ActiveRenewal", target: "Found", arrowType: solid },
        { from: "ActiveRenewal", target: "NotFound", arrowType: solid },
        { from: "Found", target: "Elegable", arrowType: solid },
        { from: "Elegable", target: "Yes3", arrowType: solid },
        { from: "Elegable", target: "No3", arrowType: solid },
        { from: "Yes3", target: "PromptForRenewal", arrowType: solid },
        { from: "PromptForRenewal", target: "No3", arrowType: solid },
        { from: "No3", target: "EndFlow", arrowType: solid },


       // { from: "ActiveRenewal", target: "NotFound", arrowType: solid },



        
    ]
    // Draw the shapes
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

    // Draw arrows
        fromTo.forEach(({ from, target, arrowType }) => {
            if ( nodes[target].type === "text") {
                yellow("from " + from + " type " + nodes[from].type + " nodes[target].type " + nodes[target].type)
                drawArrow(nodes[from], nodes[target], arrowType, noArrow);
            } else {
                drawArrow(nodes[from], nodes[target], arrowType, hasArrow);
            }
        });
    
}