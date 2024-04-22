var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  sender: {
    type: String,
    ref: 'User',
    required: true
  },
  recipient: {
    type: String,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  }});

  var chatSchema = new Schema({
    users: [{ type: String, ref: 'User' }],
    messages: [messageSchema]
  });

  var Chat = mongoose.model('Chat', chatSchema);
  var Message = mongoose.model('Message', messageSchema);
  module.exports = Chat;

