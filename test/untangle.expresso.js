
var t = require('traverser/untangle')
  , log = require('logger')
  , equals = require('traverser/equals')
  , inspect = require('inspect')
exports ['can remove repeats from a object to be JSONed'] = function (test){
  var a
    , x = [a = [1,2,3],a]
    , y = [[1,2,3],[1,2,3]]
    
  test.equal(JSON.stringify(x),JSON.stringify(y))

//  test.deepEqual(x,retangle(untangle(x)))
  test.strictEqual(x[0],x[1])

  var z = t.retangle(t.untangle(x))
  test.strictEqual(x[0],x[1])
}
exports ['can remove cycles from a object to be JSONed'] = function (test){
  var x = [1,2,3]
    x.push(x)
    
  test.strictEqual(x,x[3])

  var z = t.retangle(t.untangle(x))
  test.strictEqual(z,z[3])
}
exports ['can untangle and serialize to JSON and parse back'] = function (test){
  var x = [1,2,3], a, b, c = {a : a = [1,2,3], x: x}, e, f, d = [1,2,3,34,x,6534]
  x.push(x)
  c.c = c
  var these =
    [ [a,a]
    , x 
    , {a : a, a2: a, x: x}
    , c
    , 'hello'
    , { a : a
      , a2: e = 
        { z: 'asdfasddgsdafgasg'
        , x: x
        , y: 'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy'
        }
      , x: x
      , f: {a: a, b: b, c: c, d: d,e: e }
      }
    ]

  these.forEach(function(x){
    log(x)
    var y = t.retangle(JSON.parse(JSON.stringify(t.untangle(x))))
      , z = t.parse(t.stringify(x))
    test.ok(equals.graphs(x,y), "expected " + inspect(x) + " to equal " + inspect(y))

    test.ok(equals.graphs(x,z), "expected " + inspect(x) + " to equal " + inspect(z))

  })

}
