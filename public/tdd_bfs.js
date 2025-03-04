const bigBallOfJson = require("./test_data.json");



function createDependencyGraph(graph) {
  // 1) Map each letter -> node object for quick type lookups
  const nodeByLetter = {};
  graph.nodes.forEach((node) => {
    nodeByLetter[node.letter] = node;
  });

  // 2) Build a forward adjacency list: adjacency[from] = [to1, to2...]
  const adjacency = {};
  graph.nodes.forEach((node) => {
    adjacency[node.letter] = [];
  });
  graph.connections.forEach(({ from, to }) => {
    adjacency[from].push(to);
  });

  // 3) Identify all "box" nodes and prepare a results structure
  //    where we'll store, for each box, the "downstream" boxes and circles en route.
  const boxes = {};
  graph.nodes.forEach((node) => {
    if (node.type === "box" || node.type === "diamond") {
      boxes[node.letter] = {
        ...node,
        // We'll populate this with an array of objects, each like:
        // { box: "someBoxLetter", circles: ["circle1", "circle2", ...] }
        downstream: [],
      };
    }
  });

  // 4) Define a DFS function that:
  //    - Carries along a Set of circles encountered so far
  //    - If it reaches a new box, it records that box & circles, then stops that path
  //    - Otherwise continues exploring
  function collectDownstreamBoxesAndCircles(startBoxLetter) {
    // We'll store: Map< boxLetter, Set<circleLetters> >
    // so if multiple paths lead to the same box, we can combine circles.
    const boxToCirclesMap = new Map();

    function dfs(currentLetter, circlesSoFar, visited) {
      const currentNode = nodeByLetter[currentLetter];

      // If this node is a circle, add it to our circlesSoFar
      if (currentNode.type === "circle") {
        circlesSoFar = new Set([...circlesSoFar, currentLetter]);
      }

      // If this node is a *different* box (not the start), we've reached a "next" box.
      if ( ( currentNode.type === "box" || currentNode.type === "diamond") && currentLetter !== startBoxLetter) {
        // Merge circlesSoFar into any existing set for this box
        const prev = boxToCirclesMap.get(currentLetter) || new Set();
        boxToCirclesMap.set(
          currentLetter,
          new Set([...prev, ...circlesSoFar])
        );
        // Stop going deeper down from this box
        return;
      }

      // Otherwise, keep going
      for (const child of adjacency[currentLetter]) {
        if (!visited.has(child)) {
          visited.add(child);
          dfs(child, circlesSoFar, visited);
        }
      }
    }

    const visited = new Set([startBoxLetter]);
    dfs(startBoxLetter, new Set(), visited);

    // Convert boxToCirclesMap to an array of { box: boxLetter, circles: [ ... ] }
    return [...boxToCirclesMap.entries()].map(([boxLetter, circleSet]) => ({
      box: boxLetter,
      circles: [...circleSet],
    }));
  }

  // 5) Run this for *every* box
  for (const boxLetter in boxes) {
    boxes[boxLetter].downstream = collectDownstreamBoxesAndCircles(boxLetter);
  }

  return boxes;
}




// A small test function to demonstrate
function test_createDependencyGraph() {
  const results = createDependencyGraph(bigBallOfJson);
  console.log(JSON.stringify(results["signup"], null, 2));
}

test_createDependencyGraph();
