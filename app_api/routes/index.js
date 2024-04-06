var express = require('express');
var router = express.Router();
var jwt = require('express-jwt'); 
var auth = jwt({   // Lab 6
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

var ctrlBlogs = require('../controllers/blogs');
var ctrlAuth = require('../controllers/authentication');

router.post('/blogs', auth, ctrlBlogs.blogsCreate);
router.get('/blogs', ctrlBlogs.blogsList);
router.get('/blogs/:blogid', ctrlBlogs.blogsReadOne);
router.put('/blogs/:blogid', auth,ctrlBlogs.blogsUpdateOne, );
router.delete('/blogs/:blogid', auth, ctrlBlogs.blogsDeleteOne);

router.post('/register', ctrlAuth.register);  // Lab 6
router.post('/login', ctrlAuth.login);  // Lab 6

router.get('/friends/:userEmail', ctrlAuth.friends);

module.exports = router;