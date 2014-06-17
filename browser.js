var stream = require('stream')

module.exports = function(url) {
  var es = new EventSource(url)
  var rs = new stream.Readable({objectMode:true})

  rs._read = function() {}

  es.onmessage = function(e) {
    rs.push(e.data)
  }

  es.onerror = function(err) {
    if (rs.listeners('error').length) rs.emit('error', err)
  }

  return rs
}