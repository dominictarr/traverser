//immutable
var log = require('logger')

module.exports = exports = immutable
/*
  what about giving immutable a histroy function?
  toArray(key)

  I'm trying to be way to clever.
  just do it with max elegance & worry about optomisations when you have measurements.
*/
function immutable (obj){
  Object.defineProperty(obj,'mutate',
    { enumerable: false
    , value: 
      function (_obj){
        _obj.__proto__ = obj
        return immutable(_obj)
      }
    })
  Object.freeze(obj)
  return obj
}
exports.Array = empty

//I've added so many functions inside  this
//i'm not sure this is a good way.
//using proto isn't an advantage here.
//except that for (...) still works the same.
/*
I definately want a stackable list type,
  three ways:
    1. immutable prototype stack
    2. lispy list stack
    3. duplicate arrays.
    
  if i can comeup with a clean API i can benchmark each method...

*/
function empty(){
  return new A
}
function A (parent,value){
  var self = this

  hide(self,'push',function(x){
    var n = new A(self,x)
    n.__proto__ = self
    log('push:', x,n)
    return this.mutate(n)
  })
  hide(self,'toArray',function (){
    var a = []
    for(i in self){
      a[i] = self[i]
    }
    return a
  })
  hide(self,'forEach',function (f){
    for(i in self){
      f(self[i],i,self)
    }
  })
  hide(self,'map',function (f){
    var a = []
    for(i in self){
      a[i] = f(self[i],i,self)
    }
    return a
  })

  if(parent){
    hide(self,'length',parent.length + 1)
    self[parent.length] = value
  } else {
    hide(self,'length',0)
    immutable(self)
  }
}

function hide(obj,key,value){
  Object.defineProperty(obj,key,{enumerable: false, value: value})
}
