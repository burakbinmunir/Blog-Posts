var express = require('express');
var mongoose = require('mongoose');
var Users = require('./models/l201302_users');
var session = require('express-session');
var bodyParser = require('body-parser');
var Blogposts = require('./models/l201302_blogposts');

var app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/blog-post', { useNewUrlParser: true });

app.get('/', function (req, res) {
    res.send('Servers Runnning');
});

app.post('/register', (req, res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var newUser = new Users();
    newUser.name = name;
    newUser.email = email;
    newUser.password = password;
    newUser.save();
    res.send('User Created');
}); 

app.post('/login',async (req, res)=>{
    let email = req.body.email;
    let password = req.body.password;

    const user =  await Users.findOne({email:email, password:password});
    if (user) {
        session.Session.email = email;
        res.send('User Logged In');
    }
    else {
        res.send('User Log in Failed');
    }
});

app.put('/update-name', async (req, res)=>{
    let email = session.Session.email;
    let newName = req.body.newName;
    
    const options = {upsert: false,overwrite:true, new: true};
    const filter = {email:email};
    const updateDoc = {name:newName};

    const user = await Users.findOneAndUpdate( filter, updateDoc,options);
    
    if (user) {
        res.send('User Name Updated');
    }
    else   {
        res.send('Update failed');
    }
});

app.put('/update-password', async (req, res)=>{
    let email = session.Session.email;
    let newPassword = req.body.newPassword;

    const options = {upsert: false,overwrite:true, new: true};
    const filter = {email:email};
    const updateDoc = {password:newPassword};

    const user = await Users.findOneAndUpdate( filter, updateDoc,options);

    if (user) {
        res.send('User Password Updated');
    }else   {
        res.send('Update failed');
    }
});

app.put('/update-email', async (req, res)=>{   
    let email = session.Session.email;
    let newEmail = req.body.newEmail;

    const options = {upsert: false,overwrite:true, new: true};
    const filter = {email:email};
    const updateDoc = {email:newEmail};

    const user = await Users.findOneAndUpdate( filter, updateDoc,options);

    if (user){
        res.send('User Email Updated');
    }else   {
        res.send('Update failed');
    }
});

app.post('/create-blog', async (req, res)=>{    
    let email = session.Session.email;
    let blogname = req.body.blogname;
    let description = req.body.description;
    let date = req.body.date;
    let authorname = req.body.authorname;
    let readingtime = req.body.readingtime;

    const result = await Blogposts.findOne({userEmail:email});
    
    if (result){
        const saved = await Blogposts.findOneAndUpdate({userEmail:email}, {$push: {blogs: {blogname:blogname, description:description, date:date, authorname:authorname, readingtime:readingtime}}});
        if (saved){
            res.send('Added New Blog');
        }else   {
            res.send('Blog Addition Failed');
        }
    }else   {   
        
        const newBlog = new Blogposts();
        newBlog.userEmail = email;
        newBlog.blogs.push({
            blogname: blogname,
            description: description,
            date: date,
            authorname: authorname,
            readingtime: readingtime
        });
        const saved = await newBlog.save();
        if (saved){
            res.send('Blog Created');
        }else   {
            res.send('Blog Creation Failed');
        }
    }
    
});

app.get('/get-myblogs', async (req, res)=>{
    let email = session.Session.email;

    const blogs = await Blogposts.findOne({userEmail:email});
    if (blogs){
        res.send(blogs);
    }else   {
        res.send('No blogs found');
    }
});

app.post('/update-blogDescription', async (req, res)=>{
    let email = session.Session.email;
    let blogname = req.body.blogname;
    let newDescription = req.body.newDescription;

    const options = {upsert: false,overwrite:true, new: true};
    const filter = {userEmail:email, 'blogs.blogname':blogname};
    const updateDoc = {'blogs.$.description':newDescription};


    const blog = await Blogposts.findOneAndUpdate( filter, updateDoc,options);
    console.log(blog)
     if (blog){
        res.send('Blog Description Updated');
     }else   {
         res.send('Update failed');
    }
});

app.post('/update-blogname', async (req, res)=>{
    const email = session.Session.email;
    const blogname = req.body.blogname;
    const newBlogname = req.body.newBlogname;

    const options = {upsert: false,overwrite:true, new: true};
    const filter = {userEmail:email, 'blogs.blogname':blogname};
    const updateDoc = {'blogs.$.blogname':newBlogname};

    const blog = await Blogposts.findOneAndUpdate( filter, updateDoc,options);
    if (blog){
        res.send('Blog Name Updated');
    }else   {
        res.send('Update failed');
    }

});

app.delete('/delete-blog', async (req, res)=>{
    var blogname = req.body.blogname;
    var email = session.Session.email;

    const filter = {userEmail:email};
    const success = await Blogposts.findOneAndUpdate(filter,{ $pull: { blogs: { blogname: blogname } } });
    if (success){
        res.send('Blog Deleted');
    }else   {
        res.send('Delete failed');
    }
});

app.get('/get-allblogs', async (req, res)=>{
    const blogs = await Blogposts.find({});
    if (blogs){
        res.send(blogs);
    }else   {
        res.send('No blogs found');
    }
});

app.get('/get-blog', async (req, res)=>{
    let blogname = req.body.blogname;
    let email = req.body.email;

    const blog = await Blogposts.findOne({userEmail:email, 'blogs.blogname':blogname});
    if (blog){
        res.send(blog);
    }else   {
        res.send('No blogs found');
    }
});

app.post('/add-comment', async (req, res)=>{
    let blogger = req.body.blogger;
    let blogname = req.body.blogname;
    let comment = req.body.comment;
    let commentby = session.Session.email;

    console.log(blogger, blogname, comment, commentby);
    const options = {upsert: false,overwrite:true, new: true};
    const filter = {userEmail:blogger, 'blogs.blogname':blogname};
    const updateDoc = {$push: {'blogs.$.comments': {comment:comment, commentby:commentby}}};

    const success = await Blogposts.findOneAndUpdate( filter, updateDoc,options);
    if (success){
        res.send('Comment Added');
    }else   {
        res.send('Comment Addition Failed');
    }
});

app.get('/logout', (req, res)=>{
    session.Session.email = null;
    res.send('User Logged Out');
});


app.listen(3000, function () {
    console.log('listening on 3000')
});
