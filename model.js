/**
 * model
 * @type {*}
 */

var mongoose = require('mongoose');
// MongoDB
var db = mongoose.connect('mongodb://nodejitsu_yhanada:7lqjapp128oo3tchhfo1tkt9ci@ds043927.mongolab.com:43927/nodejitsu_yhanada_nodejitsudb2646426684');

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
});

exports.User = db.model('User', UserSchema);

// Room
var RoomSchema = new Schema({
  title: { type: String, validate: [validator, "Empty Error"] }
});

exports.Room = db.model('Room', RoomSchema);

// Comment
var CommentSchema = new Schema({
  message: { type: String, validate: [validator, "Empty Error"] }
  , room_id: { type: String }
  , user_name: { type: String, validate: [validator, "Empty Error"] }
  , created: { type: Date, default: Date.now() }
});

exports.Comment = db.model('Comment', CommentSchema);
