var request = require('request')
var split = require('split2')

module.exports = function(url, opts) {
  if (!opts) opts = {}
  if (typeof opts.retry !== 'number' && opts.retry !== false) opts.retry = 3000

  var json = !!opts.json
  var decode = function (data) {
    try {
      if (json) return JSON.parse(data)
      return data
    } catch (err) {
      return undefined
    }
  }

  var buf = ''
  var req
  var timeout

  var parse = split(function(line) {
    if (!line) {
      if (!buf) return
      var data = buf
      buf = ''
      return decode(data)
    }
    if (line.indexOf('data: ') === 0) buf += (buf ? '\n' : '') + line.slice(6)
  })

  var connect = function() {
    buf = ''
    req = request(url)

    req.on('error', function(err) {
      if (!opts.retry) parse.emit('error', err)
    })

    req.on('complete', function() {
      if (destroyed) return

      if (!opts.retry) {
        destroyed = true
        return parse.end()
      }

      timeout = setTimeout(connect, opts.retry)
      parse.emit('retry')
    })

    req.pipe(parse, {end:false})
  }

  connect()

  var destroyed = false
  parse.destroy = function() {
    if (destroyed) return
    destroyed = true
    clearTimeout(timeout)
    if (req) req.abort()
    parse.emit('close')
  }

  return parse
}