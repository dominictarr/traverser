
var traverser = require('./traverser2')

exports.branches = branches

function branches(tree){
  var b = []
  traverser(tree,{branch: branch})
  return b

  function branch(p){
    if(!p.reference){
      b.push(p.value)
      p.each() 
    }        
  }
}

exports.leaves = leaves

function leaves(tree){
  var l = []
  traverser(tree,{leaf: leaf})
  return l
  function leaf(p){
    l.push(p.value)  
  }
}


