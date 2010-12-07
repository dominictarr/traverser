var log = require('logger')
exports = module.exports = traverse

function traverse (obj,opts){

  if('function' == typeof opts)
    opts = {each: opts, before: opts}

  if(opts.before === true)
    opts.before = opts.each || opts.after

  if(opts.after === true)
    opts.after = opts.each || opts.before

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
        , halt: function (value){
            haltWith = value
            log('halt now!',haltWith)
            halt = true
          }
        , prune: function (){
            log('prune!')
            prune = true
          }
        }

  //check if this is a repeated value or a circular reference.
  function checkReference (object,props){
    props.reference = (-1 !== props.seen.indexOf(object))

    log({seen: props.seen, object: object, reference: props.reference})
    if (! props.reference) props.seen.push(object)


    props.circular = (-1 !== props.ancestors.indexOf(object))
  }

  checkReference(obj,props)

  props.after = ! (props.before = true)
  if(opts.before)
    opts.before(props)
  if(prune)
    return 

//  checkReference(obj,props)
  props.map = all(obj,props)

  props.after = !(props.before = false)
  if(opts.after)
    return opts.after(props)

  return props.map

  function all(layer,props){
    var keys = Object.keys(layer)
      , collect = [] // options for setting collect, copy, or manual
    props.ancestors.push(layer)
  
    for (key in layer){
      collect.push(item(key))

      if(halt === true){
        log('halt !',haltWith)
        return haltWith
        }
    }

    props.ancestors.pop()

    return collect 

    function item (key){
      var value = layer[key]
        , r
      props.key = key
      props.value = value
      props.parent = layer
      props.path.push(key)
      prune = false

      if('object' == typeof value && value != null){
        checkReference(value,props)

        props.after = ! (props.before = true)
        if(opts.before)
          r = opts.before(props)
        if(prune)
          return r     
        props.map = all(value,props)
        
        props.after = ! (props.before = false)
        if(opts.after)
          r = opts.after(props)

      } else if (opts.each) {
         props.after = props.before = false
         r = opts.each(props)
      }

      props.path.pop()
      return r
    }
  }
}

exports.rGet = rGet
function rGet (obj,path){
  path.forEach(function (key){
    if(obj == null)
      return obj

    obj = obj[key]
  })
  return obj
}
