var express = require('express');
var router = express.Router();


module.exports.blogList = function (req, res) {
  res.render("blogList", { title: 'Blog List' });
};
module.exports.blogAdd = function (req, res) {
  res.render("blogAdd", { title: 'Add Blog' });
};