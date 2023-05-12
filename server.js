var express = require('express');
var mongoose = require('mongoose');
var Users = require('./models/users');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/blog-post', { useNewUrlParser: true });

app.get('/', function (req, res) {
    res.send('Servers Runnning');
});

app.post('/register', (req, res)=>{
    console.log(req.body);
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

app.get('/update-name/newName', async (req, res)=>{
    let email = session.Session.email;
      
    let newName = req.params.newName;
    console.log('Sessiin', email);
    const options = {upsert: false,overwrite:true, new: true};
    const filter = {email:email};
    const updateDoc = {name:newName};
    const user = await Users.findOneAndUpdate( filter, updateDoc,options);
    console.log(user);
    if (user) {
        res.send('User Name Updated');
    }
    else   {
        res.send('Update failed');
    }
});

app.listen(3000, function () {
    console.log('listening on 3000')
});
