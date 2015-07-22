var coal = require('coalescy')
var getDtype = require('dtype')
var ndarray = require('ndarray')
var modarray = require('modarray')
var modslice = require('modslice')

module.exports = hop

function hop (opts, cb) {
  opts = coal(opts, {})

  var frame = coal(opts.frame, {})
  frame = ndarray([], frame.shape, frame.stride, frame.offset)

  var hop = coal(opts.hop, {})
  hop = ndarray([], hop.shape)
  if (hop.size > frame.size) {
    throw new Error("Hop size must be smaller than frame size")
  }

  var bufferSize = coal(
    opts.bufferSize,
    frame.size * Math.pow(2, 4)
  )

  var dtypeName = opts.dtype || 'float32'
  var Dtype = getDtype(dtypeName)

  var buffer = modarray({
    data: new Dtype(bufferSize),
    modulo: bufferSize
  })

  var offset = 0
  var hopper = 0

  return function onArray (arr) {
    // receive input
    var input = ndarray(
      arr.data, arr.shape, arr.stride, arr.offset
    )

    // assign input array at offset
    for (var i = 0; i < input.size; i++) {
      buffer.set(offset + i, input.data[i])
    }

    // increment offset
    offset += input.size

    // emit any splices
    var data
    while (
      (offset > frame.size) &&
      ((offset - hopper) >= frame.size)
    ) {

      cb(ndarray(
        modslice(buffer, hopper, hopper - frame.size).data,
        frame.shape,
        frame.stride,
        0
      ))

      hopper += hop.size
    }
  }
}
