//traverser2
var inspect = require('inspect')
  , log = require('logger')
  , curry = require('curry')

module.exports = traverse

function traverse (object,opts){

  if('function' == typeof opts)
    opts = {each: opts}

  if (opts.each)
    opts.leaf = opts.branch = opts.each
  if(!opts.leaf)
    opts.leaf = function (p){return p.value}
  if(!opts.branch)
    opts.branch = function (p){return p.iterate()}

  var funx = 
      { map: map
      , each: each 
      , copy: copy }

  if('string' == typeof opts.iterator){
    var s = opts.iterator
    opts.iterator = funx[s]
    
    if (!opts.iterator)
      throw new Error('\'' + s + '\' is not the name of a traverse iterator. try one of [' + Object.keys(funx) + ']')
    }

  var props = 
        { parent: null
        , key: null
        , value: object
        , before: true
        , circular: false
        , reference: false
        , path: [] 
        , seen: []
        , ancestors: []
        , each: curry([each],iterate)
        , map: curry([map],iterate)
        , copy: curry([copy],iterate)
        , iterate: curry(iterate,[opts.iterator])
        }

  if(opts.pre){
    props.referenced = false
    var refs = []
    traverse(object, {branch: check})
    
    function check(p){
      if(p.reference)
        refs.push(p.value)
      else
        p.each()
    }

    props.repeated = refs
  }
        
  function iterate(iterator){
    var _parent = props.parent
      , _key = props.key
      , _value = props.value
      , returned 

    props.ancestors.push(props.value)
    props.parent = props.value
    returned = iterator(props.value,makeCall)

    props.key = _key
    props.value = _value
    props.parent = _parent

    props.ancestors.pop()
    return returned
  }

  function each (object,func){
    for( key in object){
      var value = object[key]
      func(value,key,object)
    }
  }
  function map (object,func){
    var m = []
    for( key in object){
      var value = object[key]
      m.push(func(value,key,object))
    }
    return m
  }
  function copy (object,func){
    var m = new object.constructor
    for( key in object){
      var value = object[key]
      m[key] = func(value,key,object)
    }
    return m
  }
  
  function makeCall(value,key){
    var r

    if(key !== null)
      props.path.push(key)
    props.key = key
    props.value = value

    if('object' === typeof value){
      var index = 
        { seen: props.seen.indexOf(props.value)
        , ancestors: props.ancestors.indexOf(props.value) }
        
        if(opts.pre){
          index.repeated = props.repeated.indexOf(props.value)
          props.referenced = (-1 !== index.repeated)
        }

      props.index = index
    
      props.circular = (-1 !== index.ancestors)
      ;(props.reference = (-1 !== index.seen)) 
        || props.seen.push(value)

      r = opts.branch(props)
    } else {
      r = opts.leaf(props)
    }

    if(key !== null)
      props.path.pop()
    return r
  }
  
 return makeCall(object,null)
}
