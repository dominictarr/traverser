//trees.expresso.js
/*
Tree helper methods,
branches -> get all branches.
leaves -> get all leaves.
paths -> get all paths.
*/

var tr
var trees = require('traverser/trees')
  , inspect = require('inspect')
  , describe = require('should').describe

var a,b,c,d,e

var tree = 
  a = { a: 7
      , b: b =
        { c: c = [1,2,3]}
      , d: d =
        { e: e = {x: 'X'}}}
var branches = [a,b,c,d,e]
var leaves = [7,1,2,3,'X']

exports ['branches lists all branches'] = function (test){

  describe(trees.branches(tree), 'branches of ' + inspect(tree))
    .should.eql(branches)
}
exports ['leaves gets all leaves'] = function (test){
  describe(trees.leaves(tree),'leaves of ' + inspect(tree))
    .should.eql(leaves)
}
