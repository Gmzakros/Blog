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

  var Message = mongoose.model('MESSAGE', messageSchema);
  module.exports = Message;