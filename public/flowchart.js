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
    }

    setShape(type) { 
        this.type = type;
    }
}

class Diamond extends Shape {
    constructor(x, y, size, text) {
        super(x, y, size, text);
        this.setShape("diamond");
    }
}

class Box extends Shape {
    constructor(x, y, size, text) {
        super(x, y, size, text);
        this.setShape("box");
        this.backgroundColor = 'lightblue'; // Default color
    }

    toggleBackgroundColor() {
        this.backgroundColor = (this.backgroundColor === 'lightblue') ? 'lightcoral' : 'lightblue';
        drawBoxObject(this); // Redraw the box with the new color
    }
}

// Create instances
const diamond = new Diamond(50, 100, 30, 'diamond');
const box = new Box(150, 100, 30, 'box');

// Draw initial shapes
drawBoxObject(box);
drawDiamondObject(diamond);

// Toggle box background color
function toggleBackgroundColorOfTheBox() { 
    box.toggleBackgroundColor();
}
