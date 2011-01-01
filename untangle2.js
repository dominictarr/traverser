//untangle2.js

//just thought of a much more space-efficent way.

var traverse = require('traverser')
  , log = require('logger')
  , assert = require('assert')
  , render = require('render/render2')



exports.retangle = retangle
exports.untangle = untangle
exports.stringify = stringify
exports.parse = parse

function untangle(obj){
  var repeats = []
  var t = traverse(obj,{ branch: branch, pre: true })
    
//  log("unTANGLED",t)
  return t

  function branch (p){
    if(p.referenced && -1 == repeats.indexOf(p.value)){
      repeats.push(p.value)
      return  { '*@': p.index.repeated
              , '*=': p.copy() }
    }
    else if (p.reference){
      return { '*^': p.index.repeated }
    }
    if(p.value == null)
      return null//this is a bug in traverser.
    return p.copy()
  }
}
function retangle(obj){

  var repeats = []
  var t = traverse(obj,{ branch: branch})
    
  //log("reTANGLED",[obj, repeats])
  return obj

  function branch (p){
    if(!p.value){
      log("NULL?", p.value)
      return p.value
    }
    if(p.value['*@'] !== undefined && p.value['*='] !== undefined){
      repeats[p.value['*@']] = p.value['*=']
      if(p.parent)
        p.parent[p.key] = p.value['*=']
      else
        obj = p.value['*=']
    }
    else if (p.value['*^'] !== undefined){
      p.parent[p.key] = repeats[p.value['*^']] //p.value.REPEATED
//      return repeats[REPEATED_INDEX]
    }
    return p.each()
  }
}



function stringify(obj,b,c){
  return JSON.stringify(untangle(obj),b,c)
}
function parse(obj,b,c){
  return retangle(JSON.parse(obj,b,c))
}


