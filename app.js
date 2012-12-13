
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , model = require('./model')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/chat', routes.chat);
app.post('/create', routes.create);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

// models
var Comment = model.Comment;

// Socket.IO
var socketio = require('socket.io')
  , io = socketio.listen(server)
  ;
io.sockets.on('connection', function(socket) {
  io.sockets.emit('login', socket.id);

  socket.on('post', function(data) {
    var newComment = new Comment();
    newComment.message = data.message;
    newComment.room_id = data.room_id;
    newComment.user_name = socket.id;
    newComment.created = Date.now();
    newComment.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        io.sockets.emit('post', { id: socket.id, post: data.message });
      }
    });
  });
});

