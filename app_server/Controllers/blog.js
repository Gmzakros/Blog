var express = require('express');
var router = express.Router();


module.exports.blogList = function (req, res) {
  res.render("blogList", { title: 'Blog List',
  blogs: [{
    author: 'Gaige Zakroski',
    blogTitle: 'Current Runescape bank value',
    blogText: '125M',
    date: '2/15/2024'
  },
  {
    author: 'Tester 1',
    blogTitle: 'First Test',
    blogText: 'Hello World!',
    date: '1/2/1990'
  },
  {
    author: 'Tester 2',
    blogTitle: 'Huge Test',
    blogText: 'This is a huge test',
    date: '3/31/2025'
  }]});
};
module.exports.blogAdd = function (req, res) {
  res.render("blogAdd", { title: 'Add Blog' });
};

module.exports.blogEdit = function (req, res) {
  res.render("blogEdit", { title: 'Edit Blog' });
};

module.exports.blogDelete = function (req, res) {
  res.render("blogDelete", { title: 'Delete Blog' });
};