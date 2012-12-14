
/*
 * GET home page.
 */
var model = require('../model');

exports.index = function(req, res){
  var rooms = new Array();
  var Room = model.Room;
  Room.find().exec(function(err, docs) {
    for(var i = 0; i < docs.length; i++) {
      rooms.push(docs[i]);
    }
    res.render('index', { title: 'WS Chat', rooms: rooms, user: req.user });
  });
};

exports.create = function(req, res) {
  if (!req.body.name) {
    // TOOD:error
  }
  var roomName = req.body.name;
  var Room = model.Room;
  var newRoom = new Room();
  newRoom.title = roomName;
  newRoom.save(function(err) {
    if (!err) {
      res.redirect('/chat?id=' + newRoom._id);
    } else {
      console.error('Failed to save');
      res.redirect('/');
    }
  });
};

exports.chat = function(req, res){
  var Room = model.Room;
  var Comment = model.Comment;

  var roomId = req.query.id ? req.query.id : 0;
  Room.findById(roomId, function(err, room) {
    if (err) {
      // TODO:404
      return;
    }

    var title = room.title;
    var query = Comment.find({room_id: roomId}).sort('-created').limit(10);
    query.exec(function(err, comments) {
      if (err) {
        // TODO:500
        return;
      }
      for(var i = 0; i < comments.length; i++) {
        console.log(comments[i].message);
      }

      res.render('chat', { title: title, roomId: roomId, comments: comments, user: req.user });
    });
  });
};

exports.comment = function(req, res){
  var message = req.body.message;
  var roomId = req.body.room_id;
  if (message && roomId) {
    var Comment = model.Comment;
    var newComment = new Comment();
    newComment.message = message;
    newComment.room_id = roomId;
    newComment.user_name = req.user.name;
    newComment.created = Date.now();
    newComment.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        exports.io.sockets.emit('post', {post: message, user_name: req.user.name } );
      }
    });
    res.send('OK');
  } else {
    res.send(500);
  }
};

exports.status = function(req, res){
  var type = req.body.type;
  if (type === 'join') {
    exports.io.sockets.emit('status', {type: type, user_name: req.user.name } );
    res.send('OK');
  } else if (type === 'leave') {
    exports.io.sockets.emit('status', {type: type, user_name: req.user.name } );
    res.send('OK');
  } else {
    res.send(404);
  }
};

//Array to keep users.
var users = new Array();
users[0] = null;
exports.getUsers = function(){
  return users;
};

exports.getUser = function(userId){
  return users[userId];
};


//Middleware to authenticate user. Dummy.
exports.userAuthentication = function(req, res, next){
  if( req.session.userId == null){
    users.push({id:users.length, name:"第"+(users.length)+"ユーザー"});
    req.session.userId = users.length-1;
  }
  
  req.user = users[req.session.userId];
  
  next();
};
