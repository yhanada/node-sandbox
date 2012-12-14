
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
  app.use(routes.userAuthentication);// insert user middleware
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/chat', routes.chat);
app.post('/create', routes.create);
app.post('/comment', routes.comment);

//To authenticate via facebook
app.get('/signIn', routes.signIn);
app.get('/goSignIn', routes.goSignIn);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

// Socket.IO
var socketio = require('socket.io')
  , io = socketio.listen(server)
  ;
io.sockets.on('connection', function(socket) {
  io.sockets.emit('login', socket.id);
});

routes.io = io;
