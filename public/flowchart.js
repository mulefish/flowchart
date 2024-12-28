let nodes = {}
let fromTo = {}
function getY(down) {
    down /= 10
    return H *down
}

function getX(over) {
    over /= 10 
    return W * over 
}
function setTheShapes() {

    nodes = {
        "Home": new Box(getX(1), getY(6), 30, 'Home'),
        "Disclosures": new Box(getX(2), getY(6), 30, 'Disclosures'),
        "SignIn": new Diamond(getX(4), getY(6), 30, 'SignIn'),
        "Password": new Box(getX(4), getY(1), 30, 'Password'),
        "Test": new Box(getX(1), getY(1), 30, 'Test'),
    }

    for (let k in nodes) {
        const o = nodes[k]
        if (o.type === "diamond") {
            drawDiamondObject(o);
        } else if (o.type === "box") {
            drawBoxObject(o)
        } else {
            console.log("%c FAILBOT! ", "background-color:pink;")
        }
    }
    const leftRight = "leftright"
    const downUp = "downUp"
    fromTo = {
        "Home": { target: "Disclosures", direction: leftRight },
        "Disclosures": { target: "SignIn", direction: leftRight },
        "SignIn": { target: "Password", direction: downUp },
        "Home": { target: "Test", direction: downUp },
    }
    for (let key in fromTo) {
        const fromEntry = fromTo[key]
        const toKey = fromEntry.target
        const direction = fromEntry.direction
        const from = nodes[key]
        const to = nodes[toKey]
        if (direction === leftRight) {
            drawLeftRight(from, to)
        } else if ( direction === downUp) {
            drawDownUp(from, to)

        }
    }

} 