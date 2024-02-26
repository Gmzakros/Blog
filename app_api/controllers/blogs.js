const { renderFile } = require('ejs');
var mongoose = require('mongoose');
var Blogs = mongoose.model('Blog');
var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.blogsCreate = function (req, res) {
    console.log("help me");
    console.log(req.body);
    Blogs.create( req.body
        
    , function (err, blog) {
        if (err) {
            console.log(err);
            sendJSONresponse(res, 400, err);
        }
        else {
            console.log(blog);
            sendJSONresponse(res, 201, blog);

        }
    });
};
module.exports.blogsReadOne = function (req, res) {
    console.log('Finding blog details', req.params);
    if (req.params && req.params.blogid) {
        Blogs
            .findById({ _id: req.params.blogid })
            .exec(function (err, blog) {
                if (!blog) {
                    sendJSONresponse(res, 404, {
                        "message": "blogid not found"
                    });
                    return;
                } else if (err) {
                    console.log(err);
                    sendJSONresponse(res, 404, err);
                    return;
                }
                sendJSONresponse(res, 200, blog);
            });
    } else {
        console.log('No blogid specified');
        sendJSONresponse(res, 404, {
            "message": "No blogid in request"
        });
    }
};
module.exports.blogsUpdateOne = function (req, res) {
    console.log('Updating', req.params);
    if (!req.params.blogid) {
        sendJSONresponse(res, 404, {
            "Message": "Not Found, blogid is required"
        });
        return;
    }
    Blogs.findById(req.params.blogid)
        .exec(
            function (err, blog) {
                if (!blog) {
                    sendJSONresponse(res, 404, { "Message": "blogid not found" });
                    return;
                }
                else if (err) {
                    sendJSONresponse(res, 400, err);
                    return;
                }
                blog.author = req.body.author;
                blog.blogTitle = req.body.blogTitle;
                blog.blogText = req.body.blogText;
                blog.blogDate = req.body.date;
                blog.save(function (err, location) {
                    if (err) {
                        sendJSONresponse(res, 404, err);
                    }
                    else {
                        console.log("success")
                        sendJSONresponse(res, 200, blog);
                    }
                });
            }
        );
}
    ;
module.exports.blogsDeleteOne = function (req, res) {
    console.log("Deleting book entry with id of " + req.params.blogid);
        Blogs
            .findByIdAndRemove(req.params.blogid)
            .exec(
                function (err, blog) {
                    if (err) {
                        console.log(err);
                        sendJSONresponse(res, 404, err);
                        return;
                    }
                    console.log("blog id " + req.params.blogid + " deleted");
                    sendJSONresponse(res, 204, null);
                }
            );
};


/* GET a list of all blogs */
module.exports.blogsList = function (req, res) {
    console.log('Getting blogs list');
    Blogs
        .find()
        .exec(function (err, results) {
            if (!results) {
                sendJSONresponse(res, 404, {
                    "message": "no blogs found"
                });
                return;
            } else if (err) {
                console.log(err);
                sendJSONresponse(res, 404, err);
                return;
            }
            console.log(results);
            sendJSONresponse(res, 200, buildBlogList(req, res, results));
        });
};

var buildBlogList = function (req, res, results) {
    var blogs = [];
    results.forEach(function (obj) {
        blogs.push({
            _id: obj._id,
            author: obj.author,
            blogTitle: obj.blogTitle,
            blogText: obj.blogText,
            date: obj.date
        });
    });
    return blogs;
};