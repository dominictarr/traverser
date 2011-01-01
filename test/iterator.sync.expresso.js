//test iterator.sync.expresso

var sync = require('traverser/iterators').sync
  , describe = require('should').describe

/*
  each
  find
  map
  copy
  min
  max
*/

function value (v,k,o){
  describe(v,'value at object[' + k + '] in ' + arguments.callee.name)
    .should.eql(o[k],v)
  return v
}

exports.max = function (test){
  var l = [1,234,543,44,5555,534,6,456]
    , r = sync.max(l,value)
    
  describe(r,'max()')
    .should.eql(5555)
}
exports.min = function (test){
  var l = [234,543,1,44,5555,534,6,456]
    , r = sync.min(l,value)
    
  describe(r,'min()')
    .should.eql(1)
}
exports.copy = function (test){
  var l = [234,543,1,44,5555,null,534,6,456]
    , o = {a: 123, b: 123, $: null, c:'sdf', l: l}
    , n = null
    , r = sync.copy(l,value)
    , r2 = sync.copy(o,value)
    , r3 = sync.copy(null,value)
    
    describe(r,'copy()')
      .should.eql(l)

    describe(r2,'copy()')
      .should.eql(o)

    describe(r3,'copy()')
      .should.eql(n)
}
exports.map = function (test){
  var l = [234,543,1,44,5555,534,6,456]
    , o = {a: 123, b: 123, c:'sdf', l: l}
    , m = [123,123,'sdf',l]
    , r = sync.map(l,value)
    , r2 = sync.map(o,value)
    
    describe(r,'map()')
      .should.eql(l)

    describe(r2,'map()')
      .should.eql(m)
}
exports.each = function (test){
  var l = [234,543,1,44,5555,534,6,456]
    , o = {a: 123, b: 123, c:'sdf', l: l}
    , count = 0
    sync.each(l,value)
    sync.each(o,value)

    sync.each(l,cnt)

    describe(count,"calls of each()").should.eql(8)
    count = 0

    sync.each(o,cnt)
    describe(count,"calls of each()").should.eql(4)
    
    function cnt(){
      count ++
    }
}
exports.find = function (test){
  var l = [234,543,1,44,5555,'ffffffffffff',534,6,456]
    , o = {a: 123, b: 123, c:'sdf', l: l}
    , r = sync.find(l,isString)
    , r2 = sync.find(o,isString)
      describe(r,'find() string in ' + l).should.eql('ffffffffffff')
      describe(r2,'find() string in ' + o).should.eql('sdf')

  function isString (v,k,o){
    value(v,k,o)
    return ('string' == typeof v)
  }
}

