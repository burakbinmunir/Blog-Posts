const mongoose = require('mongoose');

const blogpostsSchema = new mongoose.Schema({
    userEmail: {type:String, required:true}, // for unique identification of user
    blogs: [{
        blogname: {type:String, required:true},
        description: {type:String, required:true},
        date: {type:String, required:true},
        authorname: {type:String, required:true},
        readingtime: {type:Number, required:true},
        comments: [{
            comment: {type:String, required:true},
            commentby: {type:String, required:true},
        }]
    }]
});

const Blogposts = mongoose.model('Blogposts', blogpostsSchema);

module.exports = Blogposts;