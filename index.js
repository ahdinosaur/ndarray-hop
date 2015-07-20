var coal = require('coalescy')
var ndarray = require('ndarray')
var cbuffer = require('CBuffer')
var getDtype = require('dtype')

module.exports = hop

function hop (opts, cb) {
  opts = coal(opts, {})

  var frame = coal(opts.frame, {})
  frame = ndarray([], frame.shape, frame.stride, frame.offset)

  var hopSize = opts.hopSize
  if (hopSize > frame.size) {
    throw new Error("Hop size must be smaller than frame size")
  }

  var bufferSize = coal(
    opts.bufferSize,
    frame.size * Math.pow(2, 4)
  )

  var dtypeName = opts.dtype || 'float32'
  var Dtype = getDtype(dtypeName)

  var buffer = new cbuffer(bufferSize)
  buffer.fill(0)

  var offset = 0
  var hopper = 0

  // receive ndarray
  return function onArray (arr) {
    var input = ndarray(
      arr.data, arr.shape, arr.stride, arr.offset
    )

    // assign input array at offset
    for (var i = 0; i < input.size; i++) {
      buffer.set(offset + i, arr.data[i])
    }

    // increment offset
    offset += input.size

    // emit any splices
    var data
    while (
      (offset > frame.size) &&
      ((offset - hopper) >= frame.size)
    ) {
      data = buffer.slice(hopper, hopper + frame.size)

      cb(ndarray(
        new Dtype(data),
        frame.shape,
        frame.stride,
        hopper
      ))
      hopper += hopSize
    }
  }
}
