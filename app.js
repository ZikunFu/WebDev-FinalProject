'use strict';
const express = require('express');
const mongoose = require('mongoose');

const Info = require('./models/test.js');
//database methods
//const database = require('./serverJS/database.js');
//login methods
const bcrypt = require('bcryptjs');
const { response } = require('express');

let app = express();

const dbURI = 'mongodb+srv://user1:user11234@profile.p9muv.mongodb.net/profile-info?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log('Connected to Database!'))
    .catch((err) => console.log(err));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// add new info

//app.get('/add-info', (req,res)=>{
//    const info = new Info({
//        username: 'mikeJ',
//        password: 'MiK000111',
//        win: 6,
//        loss: 3
//    });

//    info.save()
//        .then((result)=>{
//            res.send(result)
//        })
//        .catch((err)=>{
//            console.log(err);
//        });
//});

//get all the data info
app.get('/all-infos',(req,res)=>{
    Info.Info.find()
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            console.log(err);
        });
})

// view engine setup
app.set('views', __dirname+'/views');
app.set('view engine', 'pug');

function userExists(userToFind) {
    console.log("finding user");
    
    return new Promise ((resolve, reject) =>{
        Info.Info.find({username: userToFind}).then(
            function (results) {
                if(results.length >0){
                    console.log("username found in database");
                    resolve (results[0].password);
                }else{
                    console.log("username not found")
                    reject ("");
                }
            }
        );
    }); 
};


app.get('/', function (request, response) {
    response.render("home"
    ,{
        title: "Chen Yang NB"
     }
    );
});

app.get('/game', function (request, response) {
    response.render("game"
        //, {
        //    title: "The {title} variable in app.js"
        //}
    );
});

app.get('/register', function (req, response) {
    response.render("register",{
        title: "register page"
    });
});

app.post('/register', function(request, res){
    let username = request.body.username;
    let password = request.body.password;
    let newUserData = {
        username: username,
        password: password,
        win: 0,
        loss: 0,
    };
    userExists(username).then(result => {
        res.render('register',{
            title: 'Register',
            errorMessage: 'username already in used'
        });
    }).catch(error => {
        let newUser = new Info.Info(newUserData);
        newUser.save(function(error){
            if(error){
                res.render('register',{
                    title: 'Register',
                    errorMessage: 'Unable to save user'
                });
            }
            else{
                res.render('register',{
                    title: 'register successfully',
                    username: username
                })
            }
        })
    })
});

app.get('/login', function(req, res){
    
    res.render('login',{
        title: "Login page"
    });
});


app.post('/login', function(request, res){
    //Check the login info form database.
    console.log(request.body);
    let username = request.body.username;
    let password = request.body.password;
    userExists(username).then(result => {
        //Success
        console.log("input password:" + password);
        console.log("database password:"+result);
        if (result==password) {
            res.render('login', {
                title: "Login page",
                errorMessage: "Login successful!!"
            });
            //res.render('loginConfirmed',{
            //    title: "Login successful",
            //    username: username
            //});
        }else{
            res.render('login',{
                title: "Login page",
                errorMessage: "Login failed please try agian!!"
            });
        }
       
    }).catch(error => {
        res.render('login',{
            title: "Login page",
            errorMessage: "Login failed please try again!!"
        });
    }); 
});

app.get('/profile', function (request, response) {
    response.render("profile"
        //, {
        //    title: "The {title} variable in app.js"
        //}
    );
});

app.get('/guide', function (request, response) {
    response.render("guide"
        //, {
        //    title: "The {title} variable in app.js"
        //}
    );
});

app.get('/rank', function (request, response) {
    response.render("rank"
        //, {
        //    title: "The {title} variable in app.js"
        //}
    );
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    //next(err);
});


app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log(`Listening on port ${app.get('port')}`);
});
