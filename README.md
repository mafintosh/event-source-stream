# event-source-stream

[EventSource](https://developer.mozilla.org/en-US/docs/Server-sent_events/Using_server-sent_events) implemented in node as a readable stream

``` js
npm install event-source-stream
```

## Usage

``` js
var ess = require('event-source-stream')

ess('http://server-sent-events-demo.herokuapp.com/update')
  .on('data', function(data) {
    console.log('received event:', data)
  })
```

Per default it will retry after 3s when the connection terminates. Change this by setting the `retry` option

``` js
// no retries
ess('http://server-sent-events-demo.herokuapp.com/update', {retry:false}).pipe(...)

// retry after 10s
ess('http://server-sent-events-demo.herokuapp.com/update', {retry:10000}).pipe(...)
```

## License

MIT