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
  res.render("blogEdit", { title: 'Edit Blog' });
};

module.exports.blogDelete = function (req, res) {
  res.render("blogDelete", { title: 'Delete Blog' });
};

// functions.js
function myFunction() {
  alert("Hello, world!");
}
