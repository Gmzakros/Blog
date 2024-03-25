var express = require('express');
var router = express.Router();
var request = require('request');
var apiOptions = {
  server: "http://localhost"  // Change as needed
};

/* GET books lists */
module.exports.blogList = function (req, res) {
  var requestOptions, path;
  path = '/api/blogs/';
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {},
    qs: {}
  };
  request(
    requestOptions,
    function (err, response, body) {
      renderListPage(req, res, body);
    }
  );
};



var renderListPage = function (req, res, responseBody) {
  res.render('blogList', {
    title: 'Blog List',
    blogs: responseBody,
  });
};
module.exports.blogAdd = function (req, res) {
  res.render("blogAdd", { title: 'Add Blog' });
};

module.exports.addPost = function (req, res) {
  var requestOptions, path, blogid, postdata;
  path = '/api/blogs/';
  console.log("here");
  let today = new Date();
  postdata = {
    author: req.body.Author,
    blogTitle: req.body.bTitle,
    blogText: req.body.bText,
    date: `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`
  };
  console.log(postdata);

  requestOptions = {
    url: apiOptions.server + path,
    method: "POST",
    json: postdata
  };
  console.log(requestOptions.url);
  if (!postdata.author || !postdata.blogTitle || !postdata.blogText || !postdata.date) {
    res.redirect('/blogList');
  }
  else {
    request(
      requestOptions,
      function (err, response, body) {
        if (response.statusCode === 201) {
          res.redirect('/blogList');
        }
        else {
          _showError(req, res, response.statusCode);
        }
      }
    );
  }
};


module.exports.blogEdit = function (req, res) {
  var requestOptions, path;
  path = "/api/blogs/" + req.params.blogid;
  console.log(path);
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(
    requestOptions,
    function (err, response, body) {
      renderEditPage(req, res, body);
    }
  );
};


/* Render the book edit page */
var renderEditPage = function (req, res, responseBody) {
  res.render("blogEdit", {
    title: 'Edit Blog',
    blog: responseBody
  });
};


/* Book Edit Post */
module.exports.editPost = function (req, res) {
  console.log("Update blog");
  var requestOptions, path, postdata;
  var id = req.params.blogid;
  path = '/api/blogs/' + id;
  let today = new Date();
  postdata = {
    author: req.body.Author,
    blogTitle: req.body.bTitle,
    blogText: req.body.bText,
    date: `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`
  };

  requestOptions = {
    url: apiOptions.server + path,
    method: "PUT",
    json: postdata
  };

  request(
    requestOptions,
    function (err, response, body) {
      if (response.statusCode === 200) {
        res.redirect('/blogList');
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};




var renderDeletePage = function (req, res, responseBody) {
  res.render('blogDelete', {
    title: 'Delete Blog',
    blog: responseBody
  });
};

/* Book Delete */
module.exports.del = function (req, res) {
  var requestOptions, path;
  path = "/api/blogs/" + req.params.blogid;
  console.log(path);

  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(
    requestOptions,
    function (err, response, body) {
      renderDeletePage(req, res, body);
    }
  );
};


module.exports.deletePost = function (req, res) {
  var requestOptions, path, postdata;
  var id = req.params.blogid;
  path = '/api/blogs/' + id;
  requestOptions = {
    url: apiOptions.server + path,
    method: "DELETE",
    json: {}
  };

  request(
    requestOptions,
    function (err, response, body) {
      if (response.statusCode === 204) {
        res.redirect('/blogList');
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};                    