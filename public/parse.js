const graph = require("./telos.json");

function findDependencies(g) {
    let nodes = {}
    g.nodes.forEach((node)=>{
        if ( node.type == "box")
        nodes[node.letter] = {type:node.type, dependencies:[]}
    })

    return nodes 
}


const x = findDependencies(graph)
console.log( x )