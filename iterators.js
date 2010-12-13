//iterators
/*
~~~~~~~~~~~~~~~~~~~~~~~~
Sync


*/

exports.sync = {
  each: function (object,func){
    for( key in object){
      var value = object[key]
      func(value,key,object)
    }
  },
  find: function (object,func){
    for( key in object){
      var value = object[key]
      var r = func(value,key,object)
      if(r){
        return value
     }
    }
  },
  map: function (object,func){
    var m = []
    for( key in object){
      var value = object[key]
      m.push(func(value,key,object))
    }
    return m
  },
  copy: function (object,func){
    var m = new object.constructor
    for( key in object){
      var value = object[key]
      m[key] = func(value,key,object)
    }
    return m
  },
  max: function (object,func){
    var max = null
    for( key in object){
      var value = object[key]
        , r = func(value,key,object)
        if(r > max || max === null)
          max = r
    }
    return max
  },
  min: function (object,func){
    var min = null
    for( key in object){
      var value = object[key]
        , r = func(value,key,object)
        if(r < min || min === null)
          min = r
    }
    return min
  }
}
/*
~~~~~~~~~~~~~~~~~~~~~~~~
Async


*/
var curry = require('curry')

function async(object,func,collect,done){
  var keys = Object.keys(object)
    , i = 0
    item()
    function next(r){
      if(collect){//call collect(r,key,value,object,done)
        var r = collect(r,keys[i],object[keys[i]],object)
        if(r) return done(r)
      } 
      i ++ 
      if(i < keys.length)
        process.nextTick(item)
      else 
        done()
    }
    function item(){
      func(object[keys[i]],keys[i],next,object)
    }
}

exports.async = {
  each: function (object,func,done){
    async(object,func,null,done)
  },
  find: function (object,func,done){
  
    async(object,func,collect,done)
    function collect(r,k,v){
      if(r)
        return v
    }

  },
  map: function (object,func,done){
    var map = []
    async(object,func,collect,curry([map],done))
    function collect(r,k,v){
      map.push(r)
    }
  },
  copy: function (object,func,done){
    var map = new object.constructor
    async(object,func,collect,curry([map],done))
    function collect(r,k,v){
      map[k] = (r)
    }
  },
  max: function (object,func,done){
    var max 
    async(object,func,collect,fin)
    function collect(r,k,v){
      if(r > max || max == null)
        max = r
    }
    function fin (){
      done(max)
    }
  },
  min: function (object,func,done){
    var min
    async(object,func,collect,fin)
    function collect(r,k,v){
      if(r < min || min == null)
        min = r
    }
    function fin (){
      done(min)
    }
  },

}

