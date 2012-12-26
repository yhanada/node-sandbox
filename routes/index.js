
/*
 * GET home page.
 */
var model = require('../model');
var https = require('https');
var querystring = require('querystring');

exports.index = function(req, res){
  var rooms = new Array();
  var Room = model.Room;
  Room.find().sort({ created: 1, updated: -1}).exec(function(err, docs) {
    res.render('index', { title: 'WS Chat', rooms: docs, user: req.user });
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
  newRoom.created = newRoom.updated = Date.now();
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
      res.send(404);
      return;
    }

    var title = room.title;
    var query = Comment.find({room_id: roomId}).sort('-created').limit(10);
    query.exec(function(err, comments) {
      if (err) {
        res.send(500);
        return;
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
    newComment.user_id = req.user.id;
    newComment.user_name = req.user.name;
    newComment.created = Date.now();
    newComment.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        exports.io.sockets.emit('post', {post: message, user_name: req.user.name, user_id: req.user.id, room_id: roomId} );
      }
    });
    res.send('OK');
    
    //To modify a updated time of this room.
    model.Room.findByIdAndUpdate( roomId, {$set: { updated:newComment.created}}, function(error, room){});
    
  } else {
    res.send(500);
  }
};

exports.status = function(req, res){
  var type = req.body.type;
  var roomId = req.body.room_id;
  if (type === 'join') {
    exports.io.sockets.emit('status', {type: type, user_name: req.user.name, room_id: roomId } );
    res.send('OK');
  } else if (type === 'leave') {
    exports.io.sockets.emit('status', {type: type, user_name: req.user.name, room_id: roomId } );
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

//var crypto = require('crypto');
//Set up FB application
var appId = process.env.FB_APP_ID;;
var appSecret = process.env.FB_APP_SECRET;;
var appUrl = "";
if( process.env.NODE_ENV == 'development'){
  appUrl = "http://localhost:3000/goSignIn";
} else{
  appUrl = process.env.FB_CALLBACK_URL;
}

//Middleware to authenticate user. Dummy.
exports.userAuthentication = function(req, res, next){
  if( req.session.userId != null){
    req.user = users[req.session.userId];
    next();
  }else if( req.url.indexOf("/goSignIn") != -1 || req.url.indexOf("/signIn") != -1){
    next();
  }else{
    res.redirect("/signIn");
  }
};

//Login page
exports.signIn = function(req, res, next){
  var error = null;
  if( req.query.error != null){
    error = req.query.error;
    console.log(error);
  }
  
  res.render('signIn', {error:error});
};

var uuid = function(){
  var S4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4() +S4());
};

//Login exec
exports.goSignIn = function(req, res, next){
  if( req.query.code == null){
    //To go to facebook dialog
    req.session.state = uuid();

    var authUrl = "https://www.facebook.com/dialog/oauth?"+
                  "client_id="+appId+"&redirect_uri="+encodeURIComponent(appUrl)+
                  "&state="+req.session.state;
    
    res.redirect( authUrl);  
  }else{
    //back to app from facebook outh
    if( req.query.state != null && req.query.state == req.session.state){
      var code = req.query.code;
      var tokenUrl = "https://graph.facebook.com/oauth/access_token?"+
                      "client_id="+appId+"&redirect_uri="+encodeURIComponent(appUrl)+
                      "&client_secret="+appSecret+"&code="+code;
      //To get access token
      https.get( tokenUrl, function( tokenRes){
        if( tokenRes.statusCode != 200){
          res.redirect( "/signIn");
        }else{
          tokenRes.on('data', function(d) {
            var query = d.toString();//split(":");
            var parsed = querystring.parse(query/*[1]*/);
            var accessToken = parsed.access_token;
            var graphUrl = "https://graph.facebook.com/me?"+
              "access_token="+accessToken;
            console.log('access to:' + graphUrl);
            //To get user infos
            https.get( graphUrl, function( graphRes){
              var chunk = null;
              if( graphRes.statusCode != 200){
                res.redirect( "/signIn");
              }else{
                graphRes.on('data', function(d) {
                  if (chunk === null) {
                    chunk = d;
                  } else {
                    chunk += d;
                  }

                });
                graphRes.on('end', function() {
                  console.log('chunk=' + chunk.toString());
                  var userJson = JSON.parse(chunk.toString());

                  //Put user data into.. Array
                  var fbUserId = Number(userJson["id"]);
                  users[fbUserId] = {id:fbUserId, name:userJson["first_name"]};
                  console.log("%j",users[fbUserId]);

                  //Set ID into session
                  req.session.userId = fbUserId;
                  req.session.fbAccessToken = accessToken;

                  res.redirect( "/");
                });
              }
              //res.redirect( "/");
            }).on('error', function(e) {
              console.log("Got error: " + e.message);
              console.log(e.toString());
              res.redirect( "/signIn?error="+encodeURIComponent(e.message));
            });
          });
        }
      }).on('error', function(e) {
        console.log("Got error: " + e.message);
        res.redirect( "/signIn?error="+encodeURIComponent(e.message));
      });
    }else{
      res.redirect( "/signIn");
    }
  }
};

//Ajax handler for Sencha
exports.ajaxRooms = function(req, res){
  var rooms = new Array();
  var Room = model.Room;
  Room.find().sort({ created: 1, updated: -1}).exec(function(err, docs) {
    var jsonRes = { rooms: docs};
    res.json( jsonRes);
  });
};
