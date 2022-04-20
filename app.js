'use strict';
const express = require('express');
//database methods
//const database = require('./serverJS/database.js');
//login methods
//const bcrypt = require('bcryptjs');
let app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// view engine setup
app.set('views', __dirname+'/views');
app.set('view engine', 'pug');

app.get('/', function (request, response) {
    response.render("home"
    //,{
    //    title: "The title variable in app.js"
    // }
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
