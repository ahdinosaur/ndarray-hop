var ops = require('ndarray-ops')
var coal = require('coalescy')

module.exports = hop

function hop (opts, cb) {
  opts = coal(opts, {})

  var shape = opts

  var offset = 0

  // create splices

  // receive ndarray
  return function onArray (arr) {
    // assign ndarray at offset

    // increment offset

    // emit any splices
    cb(arr)
  }
}

function assign (arr, offset) {

}
