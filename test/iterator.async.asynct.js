//test iterator.async.expresso

var async = require('traverser/iterators').async
  , describe = require('should').describe
  , log = require('logger')
/*
  each
  find
  map
  copy
  min
  max
*/

function value (v,k,n,o){
//  log(v,k,n,o)
  describe(v,'value at object[' + k + '] in ' + arguments.callee.name)
    .should.eql(o[k],v)
  n(v)
}

exports.max = function (test){
  var l = [234,543,1,44,5555,534,6,456]
  async.max(l,value,c)
  function c(r){
    
    describe(r,'max()')
      .should.eql(5555)
    
    test.finish()
  }
}
exports.min = function (test){
  var l = [234,543,1,44,5555,534,6,456]
  async.min(l,value,c)
  function c(r){
    
    describe(r,'min()')
      .should.eql(1)
    
    test.finish()
  }
}
exports.copy = function (test){
  var l = [234,543,1,44,5555,534,6,456]
    , o = {a: 123, b: 123, c:'sdf', l: l}
  async.copy(l,value,c)
  function c(r){
    describe(r,'copy()')
      .should.eql(l)

    async.copy(o,value,c)
    function c(r){

    describe(r,'copy()')
      .should.eql(o)

    test.finish()
    }
  }
}

exports.map = function (test){
  var l = [234,543,1,44,5555,534,6,456]
    , o = {a: 123, b: 123, c:'sdf', l: l}
    , m = [123,123,'sdf',l]
    async.map(l,value,c)
    function c(r){
      describe(r,'map()')
        .should.eql(l)

      async.map(o,value,c)
      function c(r){

      describe(r,'map()')
        .should.eql(m)

      test.finish()
      }
    }
}

exports.each = function (test){
  var l = [234,543,1,44,5555,534,6,456]
    , o = {a: 123, b: 123, c:'sdf', l: l}
    , count = 0
    async.each(l,value,c)
    function c(){
      async.each(o,value,c)
      function c(){

        async.each(l,cnt,c)
        function c(){

          describe(count,"calls of each()").should.eql(8)
          count = 0

          async.each(o,cnt,c)
          function c(){
            describe(count,"calls of each()").should.eql(4)

            test.finish()
          }
        }
      }
    }
    function cnt(v,k,n){
      count ++
      n()
    }
}
exports.find = function (test){
  var l = [234,543,1,44,5555,'ffffffffffff',534,6,456]
    , o = {a: 123, b: 123, c:'sdf', l: l}
  async.find(l,isString,c)
  function c(r){
    describe(r,'find() string in ' + l).should.eql('ffffffffffff')
    async.find(o,isString,c)
    function c(r){
      describe(r,'find() string in ' + o).should.eql('sdf')

      test.finish()
    }
  }
  function isString (v,k,n,o){
    value(v,k,function(){},o)
    log('string?',v)
    n ('string' == typeof v)
  }
}
