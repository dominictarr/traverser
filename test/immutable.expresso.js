//immutable.expresso
var immutable = require('traverser/immutable')
  , describe = require('should').describe
  , log = require('logger')
exports ['can lock down objects with immutable'] = function (test){
  var x = immutable({x:'X'})

  log(x)

  var it =
    describe(x,'immutable object x')
  it.should.have.property('x','X')
  it.should.have.property('mutate').a('function')
}

exports ['should throw exception if you try an extend it.'] = function (test){
  var x = immutable({x:'X'})
  log(x)

  test.throws(function (){
  x.y = 'Ysdfasfsd'
  })
}
exports ['should not respond if you try and change something.'] = function (test){
  var x = immutable({x:'unchanged'})

  x.x = 'qw4tsdfhsdfh'
  
  describe(x,'immutable object x') 
    .should.have.property('x','unchanged')
}
exports ['can call mutate function to add another layer..'] = function (test){
  var x = immutable({x:'unchanged'})

  y = x.mutate({y:'MUTATED'})
  
  var it = 
    describe(y,'immutable object y') 
  it.should.have.property('x','unchanged')
  it.should.have.property('y','MUTATED')

  describe(y.__proto__,'prototype of immutable object y') 
    .should.eql(x)
}

function toA(s){

      var a = []
      for(i in s){
        a[i] = s[i]
      }
      return a
}

exports ['ImmutableArray can push'] = function (test){
  var x = immutable.Array()
    , y = x.push(1)
    , z = y.push(2)
    
//  describe(x,'empty immutable array').should.eql([])

//  var it = 
    describe(y,'immutable array [0]')
      .should.have.property('0',1)

    var it = 
      describe(z,'immutable array [1]')
    it.should.have.property('0',1)  
    it.should.have.property('1',2)  
    
    describe(z.toArray(),'immutable array [1,2]').should.eql([1,2])
    describe(z.length,'immutable array [1,2]').should.eql([1,2].length)
}
