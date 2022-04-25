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
    Info.find()
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

app.get('/login', function (request, response) {
    response.render("login"
        //, {
        //    title: "The {title} variable in app.js"
        //}
    );
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
