

function emitPinia() {
    const nodes = [];
    graph.forEach((shape) => {
      nodes.push({
        letter: shape.letter,
        human: shape.human,
        type: shape.type,
      });
    });
  
    const graphData = { nodes, connections };
  
    const theData = downstreamCirclesBetweenBoxes(graphData);
    document.getElementById("graphJson").value = JSON.stringify(theData, null, 2 )
  }
  function downstreamCirclesBetweenBoxes(graph) {
    // 1) Create a lookup from letter -> node object
    const nodeByLetter = {};
    graph.nodes.forEach((node) => {
      nodeByLetter[node.letter] = node;
    });
  
    // 2) Build a forward adjacency list,
    //    but store objects: { next: toNodeLetter, edgeType: connection.type }.
    const adjacency = {};
    graph.nodes.forEach((node) => {
      adjacency[node.letter] = [];
    });
    graph.connections.forEach(({ from, to, type: edgeType }) => {
      adjacency[from].push({ next: to, edgeType });
    });
  
    // 3) Gather all "box" nodes. We'll add .downstream to store results.
    const boxes = {};
    graph.nodes.forEach((node) => {
      if (node.type === "box" || node.type === "diamond") {
        boxes[node.letter] = {
          ...node,
          // We'll have objects like:
          //   { box: 'downstreamBoxLetter', circles: [ { letter, choice }, ... ] }
          downstream: [],
        };
      }
    });
  
    // Helper function to merge two sets of circle objects
    // we track circles in a Map keyed by circle letter -> { letter, choice }
    function unionCircleMaps(mapA, mapB) {
      const result = new Map(mapA); // clone
      for (const [letter, circleObj] of mapB.entries()) {
        result.set(letter, circleObj);
      }
      return result;
    }
  
    // 4) For each box, we do a DFS down the graph to find the *next* box(es),
    //    collecting any circle nodes encountered along each path.
    function collectDownstreamBoxesAndCircles(startBoxLetter) {
      // We'll store a map: boxLetter -> Map(circleLetter -> { letter, choice })
      const boxToCirclesMap = new Map();
  
      // DFS function carries a Map of circles so far (by letter), 
      // and merges as it goes deeper.
      function dfs(currentLetter, circlesSoFar, visited) {
        const currentNode = nodeByLetter[currentLetter];
  
        // Explore all children in adjacency
        for (const { next: childLetter, edgeType } of adjacency[currentLetter]) {
          if (!visited.has(childLetter)) {
            visited.add(childLetter);
  
            // Copy the circlesSoFar map so each path can diverge
            let newCircles = new Map(circlesSoFar);
  
            // If the child is a circle, we add it with its "choice" = edgeType
            const childNode = nodeByLetter[childLetter];
            if (childNode.type === "circle") {
              // Possibly only store if edgeType is "yes" or "no"?
              // For now, we store the raw edgeType:
              newCircles.set(childLetter, {
                letter: childLetter,
                choice: edgeType, // e.g. "yes", "no", "normal", etc.
              });
            }
  
            // If the child is a *different* box, we've reached the next box
            if ( ( childNode.type === "box" || childNode.type === "diamond" ) && childLetter !== startBoxLetter) {
              // Merge these circles into whatever we had for that box
              const existingMap = boxToCirclesMap.get(childLetter) || new Map();
              const combined = unionCircleMaps(existingMap, newCircles);
              boxToCirclesMap.set(childLetter, combined);
              // Stop going deeper from here
            } else {
              // Keep DFSing
              dfs(childLetter, newCircles, visited);
            }
          }
        }
      }
  
      const visited = new Set([startBoxLetter]);
      dfs(startBoxLetter, new Map(), visited);
  
      // Convert the boxToCirclesMap into an array:
      //   [ { box: "someBoxLetter", circles: [ { letter, choice }, ... ] } ... ]
      return [...boxToCirclesMap.entries()].map(([downstreamBox, circlesMap]) => ({
        box: downstreamBox,
        circles: [...circlesMap.values()],
      }));
    }
  
    // 5) Populate each box’s .downstream property
    for (const boxLetter in boxes) {
      boxes[boxLetter].downstream = collectDownstreamBoxesAndCircles(boxLetter);
    }
  
    return boxes;
  }
  
  
  function getDependencies() {
    const raw = downstreamCirclesBetweenBoxes(bigBallOfJson);
    const dependencies = {} 
    for ( let k in raw ) {
      const obj = convertShape( raw[k].letter,  raw[k].downstream)
      dependencies[k]=obj
    }
    const squares = {}
    const diamonds = {}
    for ( let i in bigBallOfJson.nodes ) { 
      const letter = bigBallOfJson.nodes[i].letter
      const type = bigBallOfJson.nodes[i].type
      if ( type === "circle" ) { 
        diamonds[letter]="NILL"
      } else {
        squares[letter]="NILL"
      }
    }
    return {diamonds, squares, dependencies}
   
  }
  
  function convertShape(letter, downstream) {
    let obj = {} 
    obj["url"] = letter 
    obj["preconditions"] = []
    let neededThings = [] 
    downstream.forEach((obj2)=>{
      const precognition = []
      obj2.circles.forEach((thing)=> { 
       const x = {
          "category":"diamonds",
          "key":thing.letter,
          "expected": thing.choice     
        }
        obj["preconditions"].push(x)
      })
    })
    return obj
  }
  
  
  
  