var express = require('express');
var router = express.Router();


module.exports.blogList = function (req, res) {
  res.render("blogList", { title: 'Blog List',
  blogs: [{
    author: 'Gaige',
    blogTitle: 'Current Runescape bank value',
    blogText: '125M',
    date: '2/15/24'
  }]});
};
module.exports.blogAdd = function (req, res) {
  res.render("blogAdd", { title: 'Add Blog' });
};
