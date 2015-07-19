var http = require('http')

var port = process.env['ZUUL_PORT'] || 0

var server = http.createServer(function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9966')
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

server.listen(port, function() {
  // If we're not running through zuul, just run the tests
  if (!process.env['ZUUL_PORT']) {
    server.unref()
    require('./test.js')(server.address().port)
  }
})
