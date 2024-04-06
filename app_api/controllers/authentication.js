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
    friends: []
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
