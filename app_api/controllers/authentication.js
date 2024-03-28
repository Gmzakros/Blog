var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {
  if (!req.body.name || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields are required"
    });
    return;
  }

  var user = new User({
    name: req.body.name,
    email: req.body.email
  });

  user.setPassword(req.body.password);

  user.save(function(err) {
    if (err) {
      sendJSONresponse(res, 500, err); // Changed status code to 500 for server error
      return;
    }
    var token = user.generateJwt();
    sendJSONresponse(res, 200, {
      "token": token
    });
  });
};

module.exports.login = function(req, res) {
  if (!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields are required"
    });
    return;
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      sendJSONresponse(res, 500, err); // Changed status code to 500 for server error
      return;
    }

    if (user) {
      var token = user.generateJwt();
      sendJSONresponse(res, 200, {
        "token": token
      });
    } else {
      sendJSONresponse(res, 401, info);
    }
  })(req, res);
};
