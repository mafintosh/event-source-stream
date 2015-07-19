var tape = require('tape')
var ess = require('./')

var runTests = module.exports = function (port) {
  var addr = 'http://localhost:'+port
  var opts = {withCredentials:true}

  tape('open', function (t) {
    var stream = ess(addr+'/basic', opts)

    stream.on('open', function () {
      stream.destroy()
      t.ok(true, 'open has been called')
      t.end()
    })
  })

  tape('events', function(t) {
    var stream = ess(addr+'/basic', opts)

    stream.on('data', function(data) {
      stream.destroy()
      t.same(data, 'hello world')
      t.end()
    })
  })

  tape('multiline events', function(t) {
    var stream = ess(addr+'/multiline', opts)

    stream.on('data', function(data) {
      stream.destroy()
      t.same(data, 'a\nb')
      t.end()
    })
  })

  tape('retry', function(t) {
    var stream = ess(addr+'/crash', {retry:100,withCredentials:true})
    var cnt = 2

    stream.on('data', function(data) {
      if (!--cnt) {
        stream.destroy()
        t.end()
      }
      t.same(data, 'test')
    })
  })
}

// If were running tests in the browser, run them with the zuul port
if (process.browser) {
  runTests(window.ZUUL.port)
}
