var http = require('http')

var port = process.env['PORT'] || 9966

var server = http.createServer(function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:'+port)
  res.setHeader('Access-Control-Expose-Headers', '*')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Content-Type', 'text/event-stream')
  if (req.url === '/multiline') {
    res.write('data: a\n')
    res.write('data: b\n\n')
  }
  if (req.url === '/basic') {
    res.write('data: hello world\n\n')
  }
  if (req.url === '/crash') {
    res.write('data: test\n\n')
    res.end()
  }
})

server.listen(port, function () {
  require('./test.js')
})
