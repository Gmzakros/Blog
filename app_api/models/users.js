var mongoose = require( 'mongoose' );

var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hash: String,
  salt: String,
  friends: [{
    type: String,
    unique: true 
  }],
  friendRequests: [{
    type: String,
    unique: true 
  }],
  chats: [{friendEmail: String, 
      messages: [{
        Email:String, 
        message:String
        }]
      }]
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');  
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');    
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.JWT_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

mongoose.model('User', userSchema);