var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function (req, res) {
  if (!req.body.name || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields are required"
    });
    return;
  }

  var user = new User({
    name: req.body.name,
    email: req.body.email,
    friends: [],
    friendRequest: [],
    chats:[]
  });

  user.setPassword(req.body.password);

  user.save(function (err) {
    if (err) {
      sendJSONresponse(res, 500, err); 
      return;
    }
    var token = user.generateJwt();
    sendJSONresponse(res, 200, {
      "token": token
    });
  });
};

module.exports.login = function (req, res) {
  if (!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields are required"
    });
    return;
  }

  passport.authenticate('local', function (err, user, info) {
    if (err) {
      console.log("err");

      sendJSONresponse(res, 500, err); 
      return;
    }

    if (user) {
      console.log("user")
      var token = user.generateJwt();
      sendJSONresponse(res, 200, {
        "token": token
      });
    } else {
      console.log('else');
      sendJSONresponse(res, 401, info);
    }
  })(req, res);
};


module.exports.friends = function (req, res) {
  console.log('Friends list for user with email:', req.params.userEmail);

  var userEmail = req.params.userEmail;

  User.findOne({ email: userEmail }, function(err, user) {
    if (err) {
      console.error('Error finding user:', err);
      sendJSONresponse(res, 500, { message: 'Internal server error' });
      return;
    }

    if (!user) {
      sendJSONresponse(res, 404, { message: 'User not found' });
      return;
    }

    var userFriends = user.friends;

    User.find({ email: { $in: userFriends } }, 'name email', function(err, friendUsers) {
      if (err) {
        console.error('Error finding friends:', err);
        sendJSONresponse(res, 500, { message: 'Internal server error' });
        return;
      }

      var friendsList = friendUsers.map(function(friend) {
        return {
          email: friend.email,
          name: friend.name
        };
      });

      sendJSONresponse(res, 200, friendsList);
    });
  });
};

module.exports.friendRequest = function (req, res) {
  console.log('Friends requests for user with email:', req.params.userEmail);

  var userEmail = req.params.userEmail;

  User.findOne({ email: userEmail }, function(err, user) {
    if (err) {
      console.error('Error finding user:', err);
      sendJSONresponse(res, 500, { message: 'Internal server error' });
      return;
    }

    if (!user) {
      sendJSONresponse(res, 404, { message: 'User not found' });
      return;
    }

    var userFriends = user.friendRequests;
    User.find({ email: { $in: userFriends } }, 'name email', function(err, friendUsers) {
      if (err) {
        console.error('Error finding friends:', err);
        sendJSONresponse(res, 500, { message: 'Internal server error' });
        return;
      }

      var friendsList = friendUsers.map(function(friend) {
        return {
          email: friend.email,
          name: friend.name
        };
      });

      sendJSONresponse(res, 200, friendsList);
    });
  });
};


module.exports.addFriend = function(req, res) {
  var userEmail = req.params.userEmail;
  var friendEmail = req.body.friendEmail; 

  User.findOne({ email: userEmail }, function(err, user) {
      if (err) {
          console.error('Error finding user:', err);
          return sendJSONresponse(res, 500, { message: 'Internal server error' });
      }

      if (!user) {
          return sendJSONresponse(res, 404, { message: 'User not found' });
      }

      user.friends.push(friendEmail);
      console.log('Below');
      console.log(user);
      user.save(function(err) {
          if (err) {
              console.error('Error saving user:', err);
              return sendJSONresponse(res, 500, { message: 'Internal server error' });
          }

          sendJSONresponse(res, 200, { message: 'Friend request added successfully' });
      });
  });
};

module.exports.sendFriendRequest = function(req, res) {
  console.log('Sending friend request to:', req.body.friendEmail);
  var userEmail = req.params.userEmail;
  var friendEmail = req.body.friendEmail;

  User.findOne({ email: friendEmail }, function(err, user) {
      if (err) {
          console.error('Error finding user:', err);
          return sendJSONresponse(res, 500, { message: 'Internal server error' });
      }

      if (!user) {
          return sendJSONresponse(res, 404, { message: 'User not found' });
      }

      if (user.friendRequests.indexOf(userEmail) === -1) {
          user.friendRequests.push(userEmail);

          user.save(function(err) {
              if (err) {
                  console.error('Error saving user:', err);
                  return sendJSONresponse(res, 500, { message: 'Internal server error' });
              }

              sendJSONresponse(res, 200, { message: 'Friend request added successfully' });
          });
      } else {
          sendJSONresponse(res, 400, { message: 'Friend request already sent' });
      }
  });
};

module.exports.removeFriend = function(req, res) {
  
  console.log("Removing friend: ", req.body.friendEmail);
  var userEmail = req.params.userEmail;
  var friendEmail = req.body.friendEmail; 
  console.log(friendEmail);
  User.findOneAndUpdate(
    { email: userEmail },
    { $pull: { friends: friendEmail } },
    { new: true },
    function(err, user) {
        if (err) {
            console.error('Error removing friend request:', err);
            sendJSONresponse(res, 500, { message: 'Internal server error' });
            return;
        }
        
        if (!user) {
            sendJSONresponse(res, 404, { message: 'User not found' });
            return;
        }
        
        sendJSONresponse(res, 200, { message: 'Friend request removed successfully' });
    });
  };
module.exports.friendRequestsDelete = function (req, res) {
  console.log('Removing friend request for user with email:', req.params.userEmail);

  var userEmail = req.params.userEmail;
  var friendEmail = req.body.friendEmail; 
  console.log(friendEmail);
  User.findOneAndUpdate(
      { email: userEmail },
      { $pull: { friendRequests: friendEmail } },
      { new: true },
      function(err, user) {
          if (err) {
              console.error('Error removing friend request:', err);
              sendJSONresponse(res, 500, { message: 'Internal server error' });
              return;
          }
          
          if (!user) {
              sendJSONresponse(res, 404, { message: 'User not found' });
              return;
          }
          
          sendJSONresponse(res, 200, { message: 'Friend request removed successfully' });
      }
  );
};







