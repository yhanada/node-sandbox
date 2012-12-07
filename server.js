// Express
var express = require('express')
  , http = require('http')
  , app = express()
  ;

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app).listen(3000);
console.log('server start:', 3000);

// Socket.IO
var io = require('socket.io')
  , io = io.listen(server)
  ;

io.sockets.on('connection', function(socket) {
  io.sockets.emit('login', socket.id);
  socket.on('post', function(data) {
    io.sockets.emit('post', { id: socket.id, post: data });
  });
});
