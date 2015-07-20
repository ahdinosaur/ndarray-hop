var coal = require('coalescy')
var ndarray = require('ndarray')
var cbuffer = require('CBuffer')
var getDtype = require('dtype')

module.exports = hop

function hop (opts, cb) {
  opts = coal(opts, {})

  var frameShape = opts.frameShape
  if (frameShape == null) {
    throw new Error('Frame shape not given')
  }
  var frameSize = size(frameShape)

  var hopSize = opts.hopSize
  if (hopSize > frameSize) {
    throw new Error('Hop size must be smaller than frame size')
  }

  var bufferSize = coal(
    opts.bufferSize,
    frameSize * Math.pow(2, 4)
  )

  var dtypeName = opts.dtype || 'float32'
  var Dtype = getDtype(dtypeName)

  // setup dynamic vars
  var buffer = cbuffer(bufferSize)
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
      (offset > frameSize) &&
      ((offset - hopper) >= frameSize)
    ) {
      data = buffer.slice(hopper, hopper + frameSize)

      cb(ndarray(
        new Dtype(data),
        frameShape,
        undefined,
        hopper
      ))
      hopper += hopSize
    }
  }
}

function size (shape) {
  return shape.reduce(mult)
}
function mult (a, b) {
  return a * b
}
