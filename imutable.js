//immutable


module.exports = immutable

function immutable (obj){
  obj.mutate = function (_obj){
    _obj.__proto__ = obj
    return immutable(_obj)
  }
  Object.freeze(obj)
}
