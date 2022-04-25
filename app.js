'use strict';
const express = require('express');
const mongoose = require('mongoose');

const Info = require('./models/test.js');
//database methods
//const database = require('./serverJS/database.js');
//login methods
//const bcrypt = require('bcryptjs');
let app = express();

const dbURI = 'mongodb+srv://user1:user11234@profile.p9muv.mongodb.net/profile-info?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log('Connected to Database!'))
    .catch((err) => console.log(err));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

var userdata = {};
var authorized = false;

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
    return new Promise ((resolve, reject) =>{
        Info.Info.find({username: userToFind}).then(
            function (results) {
                if (results.length > 0) {
                    userdata["username"] = results[0].username
                    console.log(results[0].username+" found in database");
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
        title: "Chen Yang NB",
        auth: authorized
     }
    );
});

app.get('/game', function (request, response) {
    if (Object.keys(userdata).length > 0) {
        response.render("game"
            , {
                data: JSON.stringify(userdata),
                auth: authorized
            }
        );
    }
    else {
        response.render("error"
            , {
                message: "Please login before playing"
            }
        );
    }
});

app.post('/game/win', (req, res) => {
    // you have address available in req.body:

    console.log("Game win Request received: " + req.body.username);
    // always send a response:
    res.json({ ok: true });
});

app.get('/login', function(req, res){
    res.render('login',{
        title: "Login page",
        auth: authorized
    });
});

app.post('/login', function(request, res){
    //Check the login info form database.
    console.log(request.body);
    let inputUsername = request.body.username;
    let inputPassword = request.body.password;
    userExists(inputUsername).then(result => {
        //Success
        console.log("input password:" + inputPassword);
        console.log("database password:"+result);
        if (result == inputPassword) {
            //set auth status
            authorized = true;
            //render success page
            res.render('login', {
                title: "Login page",
                errorMessage: "Login successful!!"
            });
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
    if (Object.keys(userdata).length > 0) {
        response.render("profile"
            , {
                data: JSON.stringify(userdata),
                auth: authorized
            }
        );
    }
    else {
        response.render("error"
            , {
                message: "Please login before viewing profile"
            }
        );
    }
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
