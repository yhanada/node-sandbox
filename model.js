/**
 * model
 * @type {*}
 */

var mongoose = require('mongoose');
// MongoDB
var db = mongoose.connect(process.env.MONGODB);

//autoIndex setting depends on enviroments
var enableAutoIndex = false;
if( process.env.NODE_ENV == 'development'){
  enableAutoIndex = true;
}

var Schema = mongoose.Schema;

function validator(v) {
  if (v) {
    return v.length > 0;
  }
  return false;
}

// User
var UserSchema = new Schema({
  name: { type: String, validate: [validator, "Empty Error"] }
}, { autoIndex: enableAutoIndex });

exports.User = db.model('User', UserSchema);

// Room
var defaultDate = new Date("2012/12/5 15:00");
var RoomSchema = new Schema({
  title: { type: String, validate: [validator, "Empty Error"] }
  , created: { type: Date, default: defaultDate }
  , updated: { type: Date, default: defaultDate }
}, { autoIndex: enableAutoIndex });

exports.Room = db.model('Room', RoomSchema);

// Comment
var CommentSchema = new Schema({
  message: { type: String, validate: [validator, "Empty Error"] }
  , room_id: { type: String }
  , user_id: { type: String }
  , user_name: { type: String, validate: [validator, "Empty Error"] }
  , created: { type: Date, default: Date.now() }
}, { autoIndex: enableAutoIndex });

exports.Comment = db.model('Comment', CommentSchema);
