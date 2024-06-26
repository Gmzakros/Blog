var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    email: String,
    author: String,
    blogTitle: String,
    blogText: String,
    date: String
});

const Blog = mongoose.model('Blog', reviewSchema);  
module.exports = Blog;