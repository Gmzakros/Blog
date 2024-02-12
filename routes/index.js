var express = require('express');
var router = express.Router();
var home = require('../Controllers/home');
var blog = require('../Controllers/blog')
/* GET home page. */
router.get('/', home.home);
router.get('/home', home.home);
router.get('/blogAdd', blog.blogAdd);
router.get('/blogList', blog.blogList);

module.exports = router;



/*

var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlContact = require('../controllers/contact');

 Setup routes to pages
router.get('/', ctrlHome.home);
router.get('/contact', ctrlContact.contact);

module.exports = router;              */