var passport = require('passport');
var mongoose = require('mongoose');
var chat = mongoose.model('Chat');
var User = mongoose.model('User');
var Chat = require('../models/messages.js');
var Message = require('../models/mess.js');
var Schema = mongoose.Schema;



var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
  };

  module.exports.addChat = function(req, res) {
    console.log('Adding chat between users:', req.params.userEmail1, 'and', req.params.userEmail2);
  
    var userEmail1 = req.params.userEmail1;
    var userEmail2 = req.params.userEmail2;

    User.findOne({ email: userEmail1 }, function(err, user1) {
        if (err) {
            console.error('Error finding user 1:', err);
            sendJSONresponse(res, 500, { message: 'Internal server error' });
            return;
        }

        if (!user1) {
            sendJSONresponse(res, 404, { message: 'User 1 not found' });
            return;
        }

        User.findOne({ email: userEmail2 }, function(err, user2) {
            if (err) {
                console.error('Error finding user 2:', err);
                sendJSONresponse(res, 500, { message: 'Internal server error' });
                return;
            }

            if (!user2) {
                sendJSONresponse(res, 404, { message: 'User 2 not found' });
                return;
            }

            Chat.findOne({ users: { $all: [userEmail1, userEmail2] } }, function(err, existingChat) {
                if (err) {
                    console.error('Error finding chat:', err);
                    sendJSONresponse(res, 500, { message: 'Internal server error' });
                    return;
                }

                if (existingChat) {
                    sendJSONresponse(res, 409, { message: 'Chat already exists between the users', chatId: existingChat._id });
                    return;
                }

                var chatData = {
                    users: [userEmail1, userEmail2],
                    messages: []
                };

                var chat = new Chat(chatData);
                chat.save(function(err, savedChat) {
                    if (err) {
                        console.error('Error saving chat:', err);
                        sendJSONresponse(res, 500, { message: 'Internal server error' });
                        return;
                    }

                    sendJSONresponse(res, 200, { message: 'Chat created successfully', chatId: savedChat._id });
                });
            });
        });
    });
};

module.exports.sendChat = function(req, res) {
    var { userEmail1, userEmail2 } = req.params;
    var { sender, content } = req.body; 

    Chat.findOne({ users: { $all: [userEmail1, userEmail2] } }, function(err, chat) {
        if (err) {
            console.error('Error finding chat:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        

        var newMessage = new Message({
            sender: userEmail1,
            recipient: userEmail2,
            content: content
        });

        chat.messages.push(newMessage);

        chat.save(function(err, updatedChat) {
            if (err) {
                console.error('Error saving chat:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            return res.status(200).json({ message: 'Chat message sent successfully', chat: updatedChat });
        });
    });
};

module.exports.getMessages = function(req, res) {
    var { userEmail1, userEmail2 } = req.params;

    Chat.findOne({ users: { $all: [userEmail1, userEmail2] } }, function(err, chat) {
        if (err) {
            console.error('Error finding chat:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        return res.status(200).json({ messages: chat.messages });
    });
};
