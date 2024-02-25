var express = require('express');
var router = express.Router();
var home = require('../Controllers/home');
var blog = require('../Controllers/blog')
/* GET home page. */
router.get('/', home.home);
router.get('/home', home.home);
router.get('/blogAdd', blog.blogAdd);
router.get('/blogList', blog.blogList);
router.post('/blogDelete/:blogid', blog.deletePost);
router.get('/blogDelete/:blogid', blog.del);

router.get('/blogEdit', blog.blogEdit);
router.post('/blogAdd', blog.addPost);

module.exports = router;
