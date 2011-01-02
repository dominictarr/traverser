
var traverser = require('traverser/traverser2')
  , log = require('logger')
  , assert = require('assert')
  , render = require('render/render2')

exports.retangle = retangle
exports.untangle = untangle
exports.stringify = stringify
exports.parse = parse

/*
this will fail if you use the forbidden keys,
 '*=','*@' and '*^'

to be totally robust, it should escape them.

instead it throws an exception, which is better than a mysterious error.
*/
  function setPath(obj,path,value){
    for(var i = 0; i < path.length -1; i ++){
      var key = path[i]
      if(obj[key])
        obj = obj[key]
      else
        obj[key] = {}
    }
    obj[path[path.length - 1]] = value
  }

function untangle(obj){
  var paths = []
    , reffed = []
    , reffed_paths = []
    , seen = []
    , links = {}
    , t = traverser(obj,{branch: branch, pre: true})
//  log('UNTANGLED:',{payload: obj, links: links})
  return t
  
  function branch(p){

  if(p.value['*$'] || p.value['*='] || p.value['*^'])
    throw new Error("object uses FORBIDDEN PROPERTY NAMES:"
      + " '*$','*=' & '*^' have a special meaning in untangle.")

    if(p.referenced){

      assert.equal(p.index.repeated, p.repeated.indexOf(p.value))
      if(-1 == reffed.indexOf(p.value)){
        assert.ok(!p.reference,'reference')
        reffed_paths[p.index.repeated] = [].concat(p.path)
        reffed[p.index.repeated] = p.value
      } else {
        setPath(links,p.path,reffed_paths[p.index.repeated])        
      }
    }
    paths.push([].concat(p.path))      
    seen.push(p.value)
    
    if (p.reference) {

//     assert.strictEqual(p.repeated[p.index.repeated],p.value)
//     assert.strictEqual(reffed[p.index.repeated],p.value, "expected:" + render(reffed[p.index.repeated]) + ' === ' + render(p.value) + '\n, within:' + render(p.repeated) + " \ncopied:" +  render(reffed))
      
      return {'[Repeated]': reffed_paths[p.index.repeated]}
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
  return traverser(obj,{branch: branch})
  
  function branch(p){
    if(p.value && p.value['[Repeated]']){
       return get(obj,p.value['[Repeated]'])
    }
    return p.copy()
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
