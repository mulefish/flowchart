const YES = "yes";
const NO = "no";
// const NORMAL = "SOMETHING";
const YELLOW = "background-color:yellow;";
const LIGHTGREEN = "background-color:lightgreen";
const canvas = document.getElementById("flowchartCanvas");
canvas.width = window.innerWidth;
canvas.height = 600;
const ctx = canvas.getContext("2d");
const boxWidth = 30;
const boxHeight = 30;
const diamondWidth = 30;
const diamondHeight = 30;
const circleDiameter = 30;
let selectedNode = null;
let everything = undefined;
const nudge = -23; // nudge text upwards a little
const FROM_NODE_WIDGET = document.getElementById("fromNode");
const FROM_NODE2_WIDGET = document.getElementById("fromNode2");
const TO_NODE_WIDGET = document.getElementById("toNode");
const TO_NODE2_WIDGET = document.getElementById("toNode2");
const NODE_KEY_DETAIL_WIDGET = document.getElementById("nodeKeyDetail");
const ANCESTOR = document.getElementById("ancestor");
const NODE_LABEL_DETAIL_WIDGET = document.getElementById("nodeLabelDetail");
const NODE_ANCESTOR_DETAIL_WIDGET =
  document.getElementById("nodeAncestorDetail");
const DELETE_NOTE_BUTTON = document.getElementById("deleteNode");

function drawBox(x, y, width, height, text, color, selected, human) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fill();
  ctx.strokeStyle = selected ? "red" : "black";
  ctx.lineWidth = selected ? 3 : 1;
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.font = "17px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const t = text + " : " + human;
  ctx.fillText(text, x + width / 2, nudge + y + height / 2);
}

function drawDiamond(x, y, width, height, text, color, selected, human) {
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX, y);
  ctx.lineTo(x + width, centerY);
  ctx.lineTo(centerX, y + height);
  ctx.lineTo(x, centerY);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = selected ? "red" : "black";
  ctx.lineWidth = selected ? 3 : 1;
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.font = "17px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const t = text + " : " + human;
  ctx.fillText(text, centerX, nudge + centerY);
}

function drawArrow_quadraticBezier(fromX, fromY, toX, toY, color = "black") {
  const headLength = 10; // Arrowhead size

  // Randomized control point for curve
  const controlX = (fromX + toX) / 2 + (Math.random() * 100 - 50);
  const controlY = (fromY + toY) / 2 + (Math.random() * 100 - 50);

  // Draw the quadratic curve
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.quadraticCurveTo(controlX, controlY, toX, toY);
  ctx.stroke();

  // t defines how far along the curve the arrow will be placed
  const t = 0.5;

  // Calculate point on curve at t
  const curveX =
    Math.pow(1 - t, 2) * fromX +
    2 * (1 - t) * t * controlX +
    Math.pow(t, 2) * toX;
  const curveY =
    Math.pow(1 - t, 2) * fromY +
    2 * (1 - t) * t * controlY +
    Math.pow(t, 2) * toY;

  // Calculate the derivative for angle (direction) at t
  const dx = 2 * (1 - t) * (controlX - fromX) + 2 * t * (toX - controlX);
  const dy = 2 * (1 - t) * (controlY - fromY) + 2 * t * (toY - controlY);
  const angle = Math.atan2(dy, dx);

  // Draw the arrowhead at the correct angle
  ctx.beginPath();
  ctx.moveTo(curveX, curveY);
  ctx.lineTo(
    curveX - headLength * Math.cos(angle - Math.PI / 6),
    curveY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    curveX - headLength * Math.cos(angle + Math.PI / 6),
    curveY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.lineTo(curveX, curveY);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "black"; // Reset for future strokes
}
class Shape {
  constructor(letter, x, y, human, color, type = "box") {
    this.letter = letter;
    this.x = x || Math.floor(Math.random() * (800 - 100)) + 100;
    this.y = y || Math.floor(Math.random() * (400 - 100)) + 100;
    this.human = human;
    this.color = color;
    this.type = type;
    this.ancestor = "";
    this.target = "";
    graph.set(letter, this);
  }
  setAncestor(a) {
    setAncestr;
  }
}

const graph = new Map();
let connections = [];
let seen = {};
function addConnection(fromNode, toNode, type, ancestor) {
  graph.get(fromNode).target = toNode;
  const compoundKey = fromNode + ":" + toNode;
  if (seen.hasOwnProperty(compoundKey)) {
    seen[compoundKey]++;
  } else {
    seen[compoundKey] = 1;
  }
  connections.push({ from: fromNode, to: toNode, type, ancestor });
  drawGraph(graph);
}

function deleteNode(nodeKey) {
  graph.delete(nodeKey);
  connections = connections.filter(
    (conn) => conn.from !== nodeKey && conn.to !== nodeKey
  );
  selectedNode = null;
  FROM_NODE_WIDGET.value = "";
  FROM_NODE2_WIDGET.value = "";
  TO_NODE_WIDGET.value = "";
  TO_NODE2_WIDGET.value = "";
  NODE_KEY_DETAIL_WIDGET.value = "";
  NODE_LABEL_DETAIL_WIDGET.value = "";
  ANCESTOR.value = "";

  drawGraph(graph);
}
let count = 0;
function updateNodeDetails(node, whence = "TBD") {
  if (count % 2 == 0) {
    FROM_NODE_WIDGET.value = node.letter;
    FROM_NODE2_WIDGET.value = node.letter;
    ANCESTOR.value = node.letter;
  } else {
    TO_NODE_WIDGET.value = node.letter;
    TO_NODE2_WIDGET.value = node.letter;
  }
  count++;
  NODE_KEY_DETAIL_WIDGET.value = node.letter;
  NODE_LABEL_DETAIL_WIDGET.value = node.human;
  DELETE_NOTE_BUTTON.disabled = !node;
}

function drawCircle(x, y, diameter, text, color, selected, human) {
  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.arc(x + diameter / 2, y + diameter / 2, diameter / 2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = selected ? "red" : "black";
  ctx.lineWidth = selected ? 3 : 1;
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.font = "17px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + diameter / 2, nudge + y + diameter / 2);
}

function drawGraph(xy) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  connections.forEach((conn) => {
    const from = xy.get(conn.from);
    const to = xy.get(conn.to);

    if (from && to) {
      let color = "black";
      if (conn.type === YES) color = "green";
      else if (conn.type === NO) color = "red";

      const fromCenterX =
        from.x +
        (from.type === "diamond"
          ? diamondWidth / 2
          : from.type === "circle"
          ? circleDiameter / 2
          : boxWidth / 2);
      const fromCenterY =
        from.y +
        (from.type === "diamond"
          ? diamondHeight / 2
          : from.type === "circle"
          ? circleDiameter / 2
          : boxHeight / 2);
      const toCenterX =
        to.x +
        (to.type === "diamond"
          ? diamondWidth / 2
          : to.type === "circle"
          ? circleDiameter / 2
          : boxWidth / 2);
      const toCenterY =
        to.y +
        (to.type === "diamond"
          ? diamondHeight / 2
          : to.type === "circle"
          ? circleDiameter / 2
          : boxHeight / 2);

      drawArrow_quadraticBezier(
        fromCenterX,
        fromCenterY,
        toCenterX,
        toCenterY,
        color
      );
    }
  });

  xy.forEach((shape) => {
    const isSelected = selectedNode && shape.letter === selectedNode.letter;
    if (shape.type === "diamond") {
      drawDiamond(
        shape.x,
        shape.y,
        diamondWidth,
        diamondHeight,
        shape.letter,
        shape.color,
        isSelected,
        shape.human
      );
    } else if (shape.type === "circle") {
      drawCircle(
        shape.x,
        shape.y,
        circleDiameter,
        shape.letter,
        shape.color,
        isSelected,
        shape.human
      );
    } else {
      drawBox(
        shape.x,
        shape.y,
        boxWidth,
        boxHeight,
        shape.letter,
        shape.color,
        isSelected,
        shape.human
      );
    }
  });
}

let draggingShape = null;
let offsetX, offsetY;

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  let foundNode = false;
  graph.forEach((shape) => {
    const width = shape.type === "diamond" ? diamondWidth : boxWidth;
    const height = shape.type === "diamond" ? diamondHeight : boxHeight;

    if (
      mouseX >= shape.x &&
      mouseX <= shape.x + width &&
      mouseY >= shape.y &&
      mouseY <= shape.y + height
    ) {
      draggingShape = shape;
      offsetX = mouseX - shape.x;
      offsetY = mouseY - shape.y;
      selectedNode = shape;
      foundNode = true;
      updateNodeDetails(shape, "addEventListener");
    }
  });

  if (!foundNode) {
    selectedNode = null;
  }
  drawGraph(graph);
});

canvas.addEventListener("mousemove", (e) => {
  if (draggingShape) {
    const rect = canvas.getBoundingClientRect();
    draggingShape.x = e.clientX - rect.left - offsetX;
    draggingShape.y = e.clientY - rect.top - offsetY;
    updateNodeDetails(draggingShape, "mousemove");
    drawGraph(graph);
  }
});

canvas.addEventListener("mouseup", () => (draggingShape = null));
canvas.addEventListener("mouseleave", () => (draggingShape = null));

document.getElementById("deleteNode").addEventListener("click", () => {
  if (selectedNode) {
    deleteNode(selectedNode.letter);
  }
});
function addNode() {
  const key = document.getElementById("nodeKey").value;
  const label = document.getElementById("nodeHuman").value;
  const color = document.getElementById("nodeColor").value;
  const type = document.getElementById("nodeType").value;
  new Shape(key, null, null, label, color, type);
  drawGraph(graph);
  document.getElementById("nodeKey").value = "";
  document.getElementById("nodeHuman").value = "";
}

function addConnection_step0() {
  const fromNode = document.getElementById("fromNode").value;
  const toNode = document.getElementById("toNode").value;
  const lineType = document.getElementById("lineType").value;
  if (fromNode === toNode) {
    alert("Self-calls are not permitted");
  } else {
    addConnection(fromNode, toNode, lineType, fromNode);
  }
}

function emitGraph() {
  const nodes = [];
  graph.forEach((shape) => {
    nodes.push(shape);
  });

  const graphData = { nodes, connections };
  document.getElementById("graphJson").value = JSON.stringify(
    graphData,
    null,
    2
  );
}

function scaleNodesToFit() {
  if (!everything || !everything.nodes || everything.nodes.length === 0) {
    console.log("No nodes available to scale.");
    return;
  }

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  everything.nodes.forEach((node) => {
    if (node.x < minX) minX = node.x;
    if (node.y < minY) minY = node.y;
    if (node.x > maxX) maxX = node.x;
    if (node.y > maxY) maxY = node.y;
  });
  const divideByZeroisBad = 0.00001;
  minX += divideByZeroisBad;
  minY += divideByZeroisBad;
  maxX += divideByZeroisBad;
  maxY += divideByZeroisBad;
  const width = canvas.width;
  const height = canvas.height;

  everything.nodes.forEach((node) => {
    node.x = ((width - 50) * node.x) / maxX;
    node.y = ((height - 30) * node.y) / maxY;
  });

  graph.clear();
  everything.nodes.forEach((node) => {
    new Shape(node.letter, node.x, node.y, node.human, node.color, node.type);
  });
  drawGraph(graph);
}

function addDecisionPoint() {
  const fromKey = document.getElementById("fromNode2").value;
  const circleKey = document.getElementById("circleKey").value;
  const toKey = document.getElementById("toNode2").value;
  const circleChoice = document.getElementById("circleChoice").value;
  const fromShape = graph.get(fromKey);
  const toShape = graph.get(toKey);
  if (!fromShape || !toShape || circleKey.length == 0) {
    alert("Invalid node keys provided or the circleKey is missing.");
    return;
  }

  connections = connections.filter(
    (conn) => !(conn.from === fromKey && conn.to === toKey)
  );
  const circleX = (fromShape.x + toShape.x) / 2;
  const circleY = (fromShape.y + toShape.y) / 2;

  let circleColor = "#ffffff";
  if (circleChoice.toLowerCase() === "yes") {
    circleColor = "#00ff00";
  } else if (circleChoice.toLowerCase() === "no") {
    circleColor = "#ff0000";
  }

  new Shape(circleKey, circleX, circleY, circleKey, circleColor, "circle");
  const circleShape = graph.get(circleKey);
  circleShape.choice = circleChoice;
  let connType;
  if (circleChoice.toLowerCase() === "yes") {
    connType = YES;
  } else if (circleChoice.toLowerCase() === "no") {
    connType = NO;
  } else {
    connType = "?";
  }
  addConnection(fromKey, circleKey, connType, fromKey);
  addConnection(circleKey, toKey, connType, fromKey);

  drawGraph(graph);

  document.getElementById("fromNode2").value = "";
  document.getElementById("circleKey").value = "";
  document.getElementById("toNode2").value = "";
  document.getElementById("ancestor").value = "";
}

async function main(nameOfTheJsonFile) {
  try {
    const response = await fetch(nameOfTheJsonFile);
    everything = await response.json();

    everything.nodes.forEach((node) => {
      new Shape(node.letter, node.x, node.y, node.human, node.color, node.type);
    });

    everything.connections.forEach((conn) =>
      addConnection(conn.from, conn.to, conn.type, conn.ancestor)
    );

    drawGraph(graph);
  } catch (error) {
    console.error("Failed to load initial data:", error);
  }
}
function copyOver(id1, id2) {
  const value1 = document.getElementById(id1).value;
  const value2 = document.getElementById(id2).value;
  if (value2.length === 0) {
    document.getElementById(id2).value = value1;
  }
}
