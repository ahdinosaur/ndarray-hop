var hop = require('./')
var through = require('through2')

module.exports = hopStream 

function hopStream (opts) {

  var stream

  var slicer = hop(opts, function (arr) {
    stream.push(arr)
  })

  stream = through.obj(function (arr, enc, cb) {
    slicer(arr)
    cb()
  })

  return stream
}
