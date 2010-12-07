
var describe = require('should').describe
  , t = require('traverser')
  , log = require('logger')
exports ['calls search function with properties object'] = function(test){
  var obj = {}
  t(obj,function (props){//calls this function on every element.
    var it = describe(props,"search properties")
      it.should.have.property ('path').eql([]).instanceof(Array)
      it.should.have.property ('parent',null)
      it.should.have.property ('value',obj)
      it.should.have.property ('key',null)
  })
}

exports ['iterates over all properties in an object'] = function (test){
  var obj = {a: 1, b: 2, c: 3}
    , checked = false
  t(obj,function (props){//calls this function on every element.
    with(props){
      log(key)
      log(value)
      log(parent)
      
      if(key){
        describe(obj[key],"obj[key=" + key + ']')
          .should.eql(value)
          
        describe(parent,"props.parent should refur to the enclosing object")
          .should.eql(obj)

        describe(path,"props.path is path to current property")
          .should.eql([key])
          
        checked = true
      }
    }
  })
  
  describe(checked,"whether search function was called with keys")
    .should.eql(true)
}

exports ['iterates over all properties in an object, at each depth'] = function (test){
  var obj = {a: 1, b: 2, c: ['a','b','c']}
    , checks = 0
  t(obj,function (props){//calls this function on every element.
    with(props){
      log(key , ':' , value)
      log(parent)
      
      if(key){//only null on root object
        describe(parent[key],"parent[key=" + key + ']')
          .should.eql(value)
          
        describe(t.rGet(obj,path),"props.parent should refur to the enclosing object")
          .should.eql(value)
      } else {
        //by default, call function on object before keys
        describe(before,'whether search function is being called on object before it\'s properties')
          .should.eql(true)
      }
      checks ++
    }
  })
  
  describe(checks,"number of times search function should be called ")
    .should.eql(7)
}

/*
  was thinking to myself just before, 
  that my dream language would be very simple
  with seamless meta programming ... 
  
  thats lisp, isn't it?
*/

exports ['can set to call functions on object after keys'] = function (test){

  var obj = {a: 1, b: 2, c: [10,20,30]}

  var f = t(obj, {each: each, after: true })
    describe(f,'result of searching, after keys, * 10 and join')
      .should.eql('10,20,100,200,300')
  function each (props){
    with (props){
      if(after){
        return map.join(',')          
      } else {
        log(key, ':', value,  parent)
        return props.value * 10
      }
    }
  }
}

exports['can just opperate on leaves'] = function (test){

  var obj = {a: 1, b: 2, c: [10,20,30]}
    , col = []
  t(obj,{each:leaves})
  
  describe(col, "collection of leaves")
    .should.eql([1,2,10,20,30])
  
  function leaves (props){
    col.push(props.value)
  }
}

exports['can just opperate on branches'] = function (test){

  var obj = {a: 1, b: 2, c: [10,20,30]}
    , col = []
  t(obj,{before:branch})
  
  describe(col, "collection of leaves")
    .should.eql([obj,obj.c])
  
  function branch (props){
    col.push(props.value)
  }
}

exports['can stop by calling halt(return value)'] = function (test){

  var obj = {a: 1, b: 2, c: [10,20,30]}
    , found = 
        t(obj,{each:each})
  
  describe(found, "find path to where value to > 10")
    .should.eql(['c','1'])
  
  function each (props){
    if(props.value > 10){
      log(props.path,':',props.value)
      props.halt([].concat(props.path))
    }
  }
}

exports['can stop exploring a branch with prune()'] = function (test){

  var obj = {a: 1, b: 2, c: [10,20,30]}
    , col = []
  obj.c.push(obj)

  t(obj,{before:branch}) // note, prune wouldn't make sense with 'after'
  
  describe(col, "unique objects in circular set")
    .should.eql([obj,obj.c])
  
  function branch (props){
    if(-1 !== col.indexOf(props.value) ){
      props.prune()
    } else {
      col.push(props.value)
    }
  }
}

exports['tells you if this object is a circular reference.'] = function (test){

  var obj = {a: 1, b: 2, c: [10,20,30], e : 1000}
    , col = []
  obj.c.push(obj)
  obj.d = obj.c

  t(obj,{before:branch}) // note, prune wouldn't make sense with 'after'
  
  describe(col, "unique objects in circular set")
    .should.eql([obj,obj.c])
  
  function branch (props){
    if(-1 !== col.indexOf(props.value) ){
      var it = 
        describe(props, "properties at point of cicular reference")
      it.should.have.property('circular',true)
      it.should.have.property('reference',true)
      it.should.have.property('seen').and.contain(props.value)
      it.should.have.property('ancestors').and.contain(props.value)
      
      props.halt()
    } else {
      col.push(props.value)
    }
  }
  var l = []
  t(obj,{before:branch2, each: leaf}) // note, prune wouldn't make sense with 'after'
  describe(l, "leaves, pruning references")
    .should.eql([1,2,10,20,30,1000])
  
  function branch2 (props){
    if(props.reference)
      return props.prune()
  }

  function leaf(props){
    l.push(props.value)
  }

  l = []
  t(obj,{before:branch3, each: leaf}) // note, prune wouldn't make sense with 'after'
  describe(l, "leaves, pruning only circular references")
    .should.eql([1,2,10,20,30,1000,10,20,30])
  
  function branch3 (props){
    if(props.circular){
      log('circuar path:',props.path)
      return props.prune()
    }
  }
}

  /*
    doing 'clever' stuff like this can put you on a balance between makeing 
    something useful, or just being twee.
    
    my next question, is what happens to map if i'm checking to prune repeated values?
    
    I might need a way to preprune..
  */


exports ['can replace circular and references'] = function (test){

  var obj = {a: 1, b: 2, c: [10,20,30], e : 1000}
  obj.c.push(obj)
  obj.d = obj.c
  var e = 
    t(obj,{each:each, after: each, before: each})
  describe(e,'')
    .should.eql("{a: 1, b: 2, [10, 20, 30, [Circular]], e: 1000, [Reference]}")
  log(e)
  
  function each(props){
    with(props)
    if(before){
      if(circular || reference){
        prune()
        return circular ? '[Circular]' : '[Reference]'
      }
    } else if(after){
      var o = map.join(', ')
      return (parent instanceof Array ? ['[',o,']'] : ['{',o,'}']).join('')
    } else {
      return (parent instanceof Array ? value : key + ': ' + value)
    }
  }
}
