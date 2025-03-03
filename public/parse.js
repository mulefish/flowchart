const graph = require("./telos.json");

// 1. Build an adjacency list
const adjacency = {};
graph.nodes.forEach((node) => {
  adjacency[node.letter] = [];
});

graph.connections.forEach((connection) => {
  // Push the 'to' into the adjacency list of 'from'
  adjacency[connection.from].push(connection.to);
});

// 2. Collect all box nodes in a dictionary for easy lookup later
const boxes = {};
graph.nodes.forEach((node) => {
  if (node.type === "box") {
    // Copy the node info and add a dependencies array
    boxes[node.letter] = {
      ...node,
      dependencies: [],
    };
  }
});

// 3. Define a DFS function to collect descendants
function getDescendants(letter, visited = new Set()) {
  let result = [];
  const children = adjacency[letter] || [];
  
  for (const child of children) {
    if (!visited.has(child)) {
      visited.add(child);
      result.push(child);
      // Recurse to collect the child's descendants
      result = result.concat(getDescendants(child, visited));
    }
  }
  return result;
}

// 4. For each box, get all descendants in the graph, 
//    optionally filter only box-type nodes
for (let k in boxes) {
  // Grab all reachable letters
  const allDescendants = getDescendants(k);
  // If you only want other 'box' nodes in dependencies:
  boxes[k].dependencies = allDescendants.filter((desc) => boxes[desc]);
  // If you want *all* node types, you can skip the filter:
  // boxes[k].dependencies = allDescendants;
}

// Now `boxes` has a `dependencies` array for each box node
console.log(boxes);
