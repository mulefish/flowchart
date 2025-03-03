const graph = require("./x.json")
const seen = {} 
graph["nodes"].forEach((node)=> { 
    if ( seen.hasOwnProperty(node.target)) {
        seen[node.target]++
    } else {
        seen[node.target] = 1 
        

    }
    if ( node.target == "" ) {
        console.log( node )
    }
})
// console.log( seen )