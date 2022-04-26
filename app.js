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
// make win and loss work and record in the database
function updateGame(usertoFind, isWin){
    console.log("finding user");
    Info.Info.find({username: usertoFind}).then(
        function(results){
            if(isWin){
                let count = results[0].win;
                count = count + 1;
                console.log(results[0].win)
                var query = {username: usertoFind};
                var newValues = { $set: {win: count}};
                Info.Info.updateOne(query, newValues, function(err, res){
                    if (err) throw err;
                    console.log('win + 1')
                })}
                else{
                    let count = results[0].loss;
                    count = count + 1;
                    console.log(results[0].loss)
                    var query = {username: usertoFind};
                    var newValues = {$set: {loss: count}};
                    Info.Info.updateOne(query, newValues, function(err, res){
                        if(err) throw err;
                        console.log('win - 1')
                    })
            }
        })
}

function calculateRank() {
    var wins = userdata[0].win;
    var loss = userdata[0].loss;
    var rank = [];

    if (wins >= 5) {
        //curr rank
        rank.push("silver")
        //next rank
        rank.push("gold")
        //games to rank up
        rank.push(10-wins)
    }
    else if (wins >= 10) {
        rank.push("gold")
        rank.push("diamond")
        rank.push(15 - wins)
    }
    else if (wins >= 15) {
        rank.push("diamond")
        rank.push("master")
        rank.push(20 - wins)
    }
    else if (wins >= 20) {
        rank.push("master")
        rank.push("Highest Rank!")
        rank.push(0)
    }
    else {
        rank.push("bronze")
        rank.push("silver")
        rank.push(5 - wins)
    }
    //total games played
    rank.push(wins+loss)
    return rank
}

function updatePassword(usertoFind, currPassword, newPassword, response) {

    Info.Info.find({ username: usertoFind }).then(
        function (results) {
            //check agains current password
            console.log(results[0])
            let databasePW = results[0].password
            if (databasePW == currPassword) {
                var query = { username: usertoFind };
                var newValues = { $set: { password: newPassword } };
                //update password
                Info.Info.updateOne(query, newValues, function (err, res) {
                    if (err) throw err;
                })
                response.render("profile"
                    , {
                        data: userdata[0],
                        auth: authorized,
                        message:"Successfult updated password"
                    }
                );
            }
            else {
                response.render("profile"
                    , {
                        data: userdata[0],
                        auth: authorized,
                        message: "Error: Current password is not matched with our database"
                    }
                );
                console.log("current password not matched")
            }

        })
}

function getUserData(usertoFind) {
    Info.Info.find({ username: usertoFind }).then(
        function (results) {
            userdata = results;
        }
    )
}

app.get('/', function (request, response) {
    
    response.render("home"
    ,{
        title: "Player!",
        data: JSON.stringify(userdata),
        auth: authorized
     }
    );
});



app.get('/game', function (request, response) {
    if (Object.keys(userdata).length > 0) {
        response.render("game"
            , {
                data: JSON.stringify(userdata[0]),
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
    console.log("Game win Request received: " + req.body.username + " with " + req.body.userWin);
    updateGame(req.body.username, req.body.userWin);
    // always send a response:
    res.json({ ok: true });
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

//login direct
app.get('/login', function(req, res){
    res.render('login',{
        title: "Login page",
        auth: authorized
    });
});

//logout direct
app.get('/logout', function (request, response) {
    userdata = {};
    authorized = false;
    response.render("home"
        , {
            title: "Chen Yang NB",
            data: JSON.stringify(userdata),
            auth: authorized
        }
    );
});


app.post('/login', function(request, res){
    //Check the login info form database.
    console.log(request.body);
    let inputUsername = request.body.username;
    let inputPassword = request.body.password;
    userExists(inputUsername).then(result => {
        //Success
        //console.log("input password: " + inputPassword);
        //console.log("database password: "+result);
        if (result == inputPassword) {
            //set auth status
            authorized = true;
            getUserData(inputUsername);
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
        var rank = calculateRank();
        var currRank = rank[0];
        var nextRank = rank[1];
        var games = rank[2];
        var total = rank[3];
        response.render("profile"
            , {
                data: userdata[0],
                auth: authorized,
                cRank: currRank,
                nRank: nextRank,
                g: games,
                t: total
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

//profile password update
app.post('/profile', function (request, res) {
    let currPassword = request.body.currPassword;
    let newPassword = request.body.newPassword;
    console.log("update password curr=" + currPassword + " new=" + newPassword);
    updatePassword(userdata[0].username, currPassword, newPassword,res);
    
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
