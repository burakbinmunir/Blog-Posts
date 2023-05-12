var blogposts = require('../models/blogposts');
var express = require('express');
var app = express();

addData = () => {
    
}



router.post('/create-blog', function (req, res) {
    var userid = req.body.userid;
    var blogname = req.body.blogname;
    var description = req.body.description;
    var date = req.body.date;
    var authorname = req.body.authorname;
    var readingtime = req.body.readingtime;
    var newBlog = new blogposts();
    newBlog.userid = userid;
    newBlog.blogs.push({
        blogname: blogname,
        description: description,
        date: date,
        authorname: authorname,
        readingtime: readingtime
    });
    newBlog.save();
    res.send('Blog Created');
}
);
router.get('/get-blogs', function (req, res) {
    blogposts.find({}, function (err, data) {
        if (err) {
            console.log(err);
            res.send('Error Occured');
        }
        else {
            res.send(data);
        }
    }
    );
}   );
router.get('/get-blog/:id', function (req, res) {
    var id = req.params.id;
    blogposts.findById(id, function (err, data) {
        if (err) {
            console.log(err);
            res.send('Error Occured');
        }
        else {
            res.send(data);
        }
    }
    );
}
);
//router.put('/update-blog/:id', function (req, res) {
//    var id = req.params.id;
//    var blogname = req.body.blogname;
//    var description = req.body.description;
//    var date = req.body.date;
//    var authorname = req.body.authorname;
//    var readingtime = req.body.readingtime;
//    blogposts.findById(id, function (err, data) {
//        if (err) {

//            console.log(err);
//            res.send('Error Occured');
//        }
//        else {
//            data.blogname = blogname;

//            data.description = description;
//            data.date = date;
//            data.authorname = authorname;
//            data.readingtime = readingtime;
//            data.save();
//            res.send('Blog Updated');
//        }
//    }
//    );
//}
//);
