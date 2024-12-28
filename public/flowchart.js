class Shape { 
    constructor(x, y, size, text) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.text = text;
        this.leftX = x;
        this.leftY = y + (size / 2);
        this.rightX = x + size;
        this.rightY = y + (size / 2);
        this.type = undefined;
        this.backgroundColor = 'lightgray';
        this.toggleColors = ['lightgray', 'yellow'];
    }

    setShape(type) { 
        this.type = type;
    }

    setToggleColors(color1, color2) {
        this.toggleColors = [color1, color2];
        this.backgroundColor = color1;
    }

    toggleBackgroundColor() {
        this.backgroundColor = (this.backgroundColor === this.toggleColors[0]) 
            ? this.toggleColors[1] 
            : this.toggleColors[0];
        
        this.redraw();
    }

    redraw() {
        if (this.type === 'box') {
            drawBoxObject(this);
        } else if (this.type === 'diamond') {
            drawDiamondObject(this);
        }
    }
}

class Diamond extends Shape {
    constructor(x, y, size, text) {
        super(x, y, size, text);
        this.setShape("diamond");
        this.setToggleColors('lightgreen', 'lightpink');
    }
}

class Box extends Shape {
    constructor(x, y, size, text) {
        super(x, y, size, text);
        this.setShape("box");
        this.setToggleColors('lightblue', 'lightcoral');
    }
}

function toggle(key){ 
    nodes[key].toggleBackgroundColor()
}

const nodes = {
    "d1": new Diamond(50, 100, 30, 'diamond'),
    "b1": new Box(150, 100, 30, 'box'),
    "b2": new Box(200, 30, 30, 'b2'),
}
for ( let k in nodes ) {
    const o = nodes[k] 
    if ( o.type === "diamond") {
        drawDiamondObject(o);
    } else if ( o.type === "box") {
        drawBoxObject(o)
    } else {
        console.log("%c FAILBOT! ", "background-color:pink;")
    }
}

drawArrow(100,100,300,120)