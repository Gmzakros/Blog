var express = require('express');
var router = express.Router();
var jwt = require('express-jwt'); 
var auth = jwt({  
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

var ctrlBlogs = require('../controllers/blogs');
var ctrlAuth = require('../controllers/authentication');
var ctrlChat = require('../controllers/messages');

router.post('/blogs', auth, ctrlBlogs.blogsCreate);
router.get('/blogs', ctrlBlogs.blogsList);
router.get('/blogs/:blogid', ctrlBlogs.blogsReadOne);
router.put('/blogs/:blogid', auth,ctrlBlogs.blogsUpdateOne );
router.delete('/blogs/:blogid', auth, ctrlBlogs.blogsDeleteOne);

router.post('/register', ctrlAuth.register);  // Lab 6
router.post('/login', ctrlAuth.login);  // Lab 6

router.get('/friends/:userEmail', ctrlAuth.friends);
router.get('/friendRequests/:userEmail', ctrlAuth.friendRequest)
router.post('/friends/:userEmail', function(req, res){
  ctrlAuth.sendFriendRequest(req, res);
});

router.post('/friendRequests/:userEmail', ctrlAuth.addFriend);
router.delete('/friendRequests/:userEmail', function(req, res) {
  ctrlAuth.friendRequestsDelete(req, res);
});

router.delete('/friends/:userEmail', function(req, res) {
  ctrlAuth.removeFriend(req, res);
});


router.post('/chats/:userEmail1/:userEmail2', ctrlChat.addChat);
router.post('/chatSend/:userEmail1/:userEmail2',ctrlChat.sendChat);
router.get('/chats/:userEmail1/:userEmail2',ctrlChat.getMessages);



module.exports = router;