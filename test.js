var test = require('tape')
var hop = require('./')
var slice = Array.prototype.slice

test("hop unaligned", function(t) {
  
  var expectedFrames = [
    [0,1,2,3,4,5,6],
    [3,4,5,6,7,8,9],
    [6,7,8,9,10,11,12],
    [9,10,11,12,13,14,15],
    [12,13,14,15,16,17,18],
    [15,16,17,18,19,20,21]
  ]

  t.plan(expectedFrames.length * 2)
  
  var frameShape = [7]

  var slicer = hop({
    frame: { shape: frameShape },
    hop: { shape: [3] }
  }, function (x) {
    var f = expectedFrames[0]
    expectedFrames.shift()
    t.deepEqual(slice.call(x.data), f)
    t.deepEqual(x.shape, frameShape)
  })
  
  function pushData(arr) {
    slicer({
      data: new Float32Array(arr),
      shape: [arr.length]
    })
  }
  
  pushData([0,1,2])
  pushData([3,4])
  pushData([5,6,7,8,9,10,11])
  pushData([12,13])
  pushData([14,15,16,17,18,19,20,21])
})

/*
require("tape")("frame-hop aligned", function(t) {
  
  var expectedFrames = [
    [0,1,2,3],
    [2,3,4,5],
    [4,5,6,7],
    [6,7,8,9],
    [8,9,10,11],
    [10,11,12,13],
    [12,13,14,15],
    [14,15,16,17],
    [16,17,18,19],
    [18,19,20,21]
  ]
  
  t.plan(expectedFrames.length)
  
  var slicer = hop({
    frameSize: 4,
    hopSize: 2,
    maxDataSize: 8
  })
  
  slicer.pipe(through.obj(function (x, enc, cb) {
    var f = expectedFrames[0]
    expectedFrames.shift()
    t.same(Array.prototype.slice.call(x, 0), f)
    cb()
  }))

  function pushData(arr) {
    slicer.write(new Float32Array(arr))
  }
  
  pushData([0,1,2])
  pushData([3,4])
  pushData([5,6,7,8,9,10,11])
  pushData([12,13])
  pushData([14,15,16,17,18,19,20,21])
})
*/
