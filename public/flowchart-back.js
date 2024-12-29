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

function getInbetween(obj1, obj2) {
    return { x: (obj1.x + obj2.x) / 2, y: (obj1.y + obj2.y) / 2 }
}
function setTheShapes() {
    // Relative positioning! Not as clever as a general force directed graph with springs and gravity but way way simplier. 
    // And not hard coded! This relative stuff is a OK comprimise(sic) methinks. 
    //
    // NOTE: negative is UP!
    const refpoint = { x: 1 * GRID_X, y: 5 * GRID_Y }
    const Home = new Box(getX(refpoint, 0), getY(refpoint, 0), 20, 'Home')
    const Disclosures = new Box(getX(Home, 1), getY(Home, 0), 20, 'Disclosures')
    const SignIn = new Diamond(getX(Disclosures, 1.5), getY(Disclosures, 0.5), 10, 'SignIn')
    const Password = new Box(getX(SignIn, 0), getY(SignIn, -4), 10, 'Password')
    const SignUp = new Box(getX(SignIn, -1), getY(SignIn, 2), 20, 'SignUp')
    const STA = new Box(getX(SignUp, 1), getY(SignUp, 0), 20, 'STA')
    const Snow = new Box(getX(STA, 1), getY(STA, 0), 20, 'Snow?')
    const _inbetween = getInbetween(Snow, SignIn)
    const No1 = new TextObj(getX(_inbetween, 0.2), getY(_inbetween, 0), 0, 'No')
    const Yes1 = new TextObj(getX(Snow, 1), getY(Snow, 0), 0, 'Yes')
    const Associate = new Box(getX(Yes1, 1), getY(Yes1, 0), 20, 'Associate')
    const STALookup = new Box(getX(Associate, 1), getY(Associate, 0), 20, 'STA<br/>Lookup')
    const Yes2 = new TextObj(getX(STALookup, 1), getY(STALookup, -1), 0, 'Yes')
    const No2 = new TextObj(getX(STALookup, 1), getY(STALookup, 1), 0, 'No')
    const ActiveRenewal = new Box(getX(Yes2, 1), getY(Yes2, -1), 20, 'Active<br/>Renewal')
    const Found = new TextObj(getX(ActiveRenewal, 1), getY(ActiveRenewal, -2), 0, 'Found')
    const NotFound = new TextObj(getX(ActiveRenewal, 1), getY(ActiveRenewal, 3), 0, 'Not Found')
    const Elegable = new Diamond(getX(Found, 1), getY(Found, -1), 20, 'Renewable?')
    const Yes3 = new TextObj(getX(Elegable, 0.5), getY(Elegable, 3), 0, 'Yes')
    const No3 = new TextObj(getX(Elegable, 1.5), getY(Elegable, 0), 0, 'No')
    const PromptForRenewal = new Diamond(getX(Yes3, 1.2), getY(Disclosures, 0), 10, 'Prompt<br/>For<br/>Renewal')
    const EndFlow = new Box(getX(No3, 1), getY(No3, -1), 20, 'End flow')
    const Yes4 = new TextObj(getX(PromptForRenewal, 1), getY(PromptForRenewal, 1), 0, 'Yes')
    const ReprintRequired = new Diamond(getX(Yes4, 1), getY(Yes4, 1), 10, 'Reprint<br/>Required')
    const Yes5 = new TextObj(getX(ReprintRequired, 1), getY(ReprintRequired, 1), 0, 'Yes')
    const ReprintNotice = new Box(getX(Yes5, 1), getY(Yes5, 0), 20, 'Reprint<br/>Notice')
    const ActiveEnrollmentInSnow = new Diamond(getX(NotFound, 1), getY(NotFound, 0), 20, 'Active<br/>Enroll<br/>Snow?')
    const LocationFinder = new Box(getX(ReprintNotice, 1.2), getY(ReprintNotice, 0), 20, 'Location<br/>Finder')
    const LegalNames = new Box(getX(LocationFinder, 1), getY(LocationFinder, 0), 20, 'Legal<br/>Names')


    nodes = {
        Home,
        Disclosures,
        SignIn,
        Password,
        SignUp,
        STA,
        Snow,
        No1,
        Yes1: Yes1,
        Associate,
        STALookup,
        Yes2,
        No2,
        ActiveRenewal,
        NotFound,
        Found,
        Elegable,
        EndFlow,
        Yes3,
        No3,
        PromptForRenewal, 
        Yes4,
        ReprintRequired,
        Yes5,
        ReprintNotice,
        ActiveEnrollmentInSnow,
        LocationFinder,
        LegalNames
    }

    // Define edges
    fromTo = [
        { from: "Home", target: "Disclosures", arrowType: solid },
        
        { from: "Disclosures", target: "SignIn", arrowType: solid },
        { from: "SignIn", target: "Password", arrowType: solid },
        { from: "SignIn", target: "SignUp", arrowType: dashed },
        { from: "SignUp", target: "STA", arrowType: solid },
        { from: "STA", target: "Snow", arrowType: solid },
      //  { from: "Snow", target: "No1", arrowType: solid },
        { from: "Snow", middle: "No1", target: "SignIn", arrowType: solid },
      //  { from: "No1", target: "SignIn", arrowType: solid },
      //  { from: "Snow", target: "Yes1", arrowType: solid },
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
        { from: "PromptForRenewal", target: "Yes4", arrowType: solid },
        { from: "Yes4", target: "ReprintRequired", arrowType: solid },
        { from: "ReprintRequired", target: "Yes5", arrowType: solid },
        { from: "Yes5", target: "ReprintNotice", arrowType: solid },
        { from: "NotFound", target: "ActiveEnrollmentInSnow", arrowType: solid },
        { from: "ReprintNotice", target: "LocationFinder", arrowType: solid },
        { from: "LocationFinder", target: "LegalNames", arrowType: solid },


    ]
    // Draw the shapes!
    for (let k in nodes) {
        const o = nodes[k];
        if (o.type === "diamond") {
            drawDiamondObject(o);
        } else if (o.type === "box") {
            drawBoxObject(o);
        } else if (o.type === "text") {
            drawTextObject(o);
        }
    }

    // Draw arrows!
    fromTo.forEach((entry)=> {

        const f = nodes[entry.from]
        const t = nodes[entry.target]
        const m = entry.middle
        const arrowType = entry.arrowType
        const hasArrow = entry.hasArrow
        if ( m !== undefined ) {
            // DRAW LINE HERE
        } else {
         drawArrow(f, t , arrowType, hasArrow);

        }



    });

}