
var traverser = require('traverser/traverser2')
  , log = require('logger')
exports.retangle = retangle
exports.untangle = untangle
exports.stringify = stringify
exports.parse = parse

function untangle(obj){
  var paths = []

  return traverser(obj,{branch: branch})
  
  function branch(p){
    paths.push([].concat(p.path))      
    if (p.reference) {
      return {'[Repeated]': paths[p.index.seen]}
    }
    return p.copy()
  }
}

function get(obj,path){
  for(i in path){
    obj = obj[path[i]]
  }
  return obj
}

function retangle(obj){
   traverser(obj,{branch: branch})
  return obj  
  function branch(p){
    if(p.value && p.value['[Repeated]']){
       p.parent[p.key] = get(obj,p.value['[Repeated]'])
    }      
    return p.each()
  }
}

function stringify(obj,func){
  try {
  return JSON.stringify(untangle(obj),func)
  } catch (err){
    log('PROBLEM WHEN TRYING TO STRINGIFY:',obj)
    throw err
  }
}
function parse(string,func){
  return retangle(JSON.parse(string,func))
}
