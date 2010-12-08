var log = require('logger')
//  , inspect = require(
exports = module.exports = traverse

function traverse (obj,opts){

  if('function' == typeof opts)
    opts = {each: opts, before: opts}

  if(opts.before === true)
    opts.before = opts.each || opts.after

  if(opts.after === true)
    opts.after = opts.each || opts.before

    collect = opts.collect || {
      new: function (){
        return []}
    , add: function (props){
        with(props) collect.push(returned)
      return 
      }
    }

  var halt = false
    , haltWith
    , prune = false
    , props = 
        { parent: null
        , key: null
        , value: obj
        , before: true
        , circular: false
        , reference: false
        , path: [] 
        , seen: []
        , ancestors: []
        , add: collect.add 
        , new: collect.new
        , halt: function (value){
            haltWith = value
            halt = true
          }
        , prune: function (){
            prune = true
          }
        }

  //check if this is a repeated value or a circular reference.
  function checkReference (object,props){
    props.reference = (-1 !== props.seen.indexOf(object))

    if (! props.reference) 
      props.seen.push(object)

    props.circular = (-1 !== props.ancestors.indexOf(object))
  }

  var r = item (null,obj,null)
  if(halt)
    return haltWith
  if(prune)
    return r
  return  r
  
  function all(layer,props){
    if(layer !== null)
      props.ancestors.push(layer)
    if(props.new)
      props.collect = props.new(props)

    var keys = Object.keys(layer)
      , collect =  props.collect 
    
  
    for (var key in layer){
      //vvvinto function
      var value = layer[key]
      props.returned = item(key,value,layer)
      
      props.key = key
      props.value = value
      props.collect = collect
      
      if(props.collect && props.add)
        props.add(props)
      //^^^into function
      if(halt === true){
        return haltWith
        }
    }

    if(layer !== null)
      props.ancestors.pop()

    return collect 

  }
    function item (key,value,layer){
        var r
      props.key = key
      props.value = value
      props.parent = layer
      if(key !== null)
        props.path.push(key)
      prune = false

      if('object' == typeof value && value != null){
        checkReference(value,props)

        props.after = ! (props.before = true)
        if(opts.before)
          r = opts.before(props)
        if(prune)
          return r     
        all(value,props)
        
        props.key = key
        props.value = value
        props.parent = layer
      /*
      is before and after a source of complications?
      better to use around (each) function and pass an expand layer function in?
      better to make wrap function to call next layer?
      
      that would certainly give more control than prune.

      how to handle collecting?

      have a series of methods:
        each, // dont collect
        collect, //return values
        select, //if return value truthy
        reject, //if return value falsey
        find, //first truthy
        copy, //make object
        
        --- by passing the prop setup function into the iterator
        
        {branch: b, leaf: l, iterator: i}
        
        iterator gets passed
        props, with function: call
        which takes key
        
        the purpose of this module?
          seperate the aspects parts of traversing a datastruct
          
        what about using a idiomatic iterator that takes args (v,k)
        
        so make a call function present that interface.
        but also curry it into a set of iterators.
      */

        props.after = ! (props.before = false)
        if(opts.after){
          r = opts.after(props)
        }
      } else if (opts.each) {
         props.after = props.before = false
         r = opts.each(props)
      }

      if(key !== null)
        props.path.pop()
      return r
    }

}

//exports.set(key,value)

exports.rGet = rGet
function rGet (obj,path){
  path.forEach(function (key){
    if(obj == null)
      return obj

    obj = obj[key]
  })
  return obj
}

exports.topology = topology 
function topology (obj){
/*
  branches but no leaves
*/
}

exports.copy = copy
function copy(obj,opts){
  var collector = 
    { new: function (props){
        return new props.value.constructor() }
    , add: function (props){
        with(props)
          collect[key] = returned
        return } 
    }
    opts = opts || {}
    opts.each = opts.each || each
    opts.after = opts.after || each
    opts.collect = collector
    
  return traverse(obj,opts)

  function each(props){
    with(props)
      return after ? collect : value
  }
}
