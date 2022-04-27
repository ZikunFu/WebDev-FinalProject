'use strict';
//Dependency
const express = require('express');
const mongoose = require('mongoose');
//Database Info
const Info = require('./models/test.js');
//MongoDB connect
const dbURI = 'mongodb+srv://user1:user11234@profile.p9muv.mongodb.net/profile-info?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log('MongoDB Connected.'))
    .catch((err) => console.log(err));
//Express app setup
let app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

//Current user session variables
var userdata = {};
var authorized = false;

//Helper functions

//Check if user exists in database
function userExists(userToFind) {
    return new Promise((resolve, reject) => {
        Info.Info.find({ username: userToFind }).then(
            function (results) {
                if (results.length > 0) {
                    userdata["username"] = results[0].username
                    //console.log(results[0].username + " found in database");
                    resolve(results[0].password);
                } else {
                    //console.log("username not found")
                    reject("");
                }
            }
        );
    });
};

//Update database with end game results
function updateGame(usertoFind, isWin){
    //console.log("finding user");
    Info.Info.find({username: usertoFind}).then(
        function(results){
            if(isWin){
                let count = results[0].win;
                count = count + 1;
                //console.log(results[0].win)
                var query = {username: usertoFind};
                var newValues = { $set: {win: count}};
                Info.Info.updateOne(query, newValues, function(err, res){
                    if (err) throw err;
                    //console.log('User data: win + 1')
                })}
                else{
                    let count = results[0].loss;
                    count = count + 1;
                    //console.log(results[0].loss)
                    var query = {username: usertoFind};
                    var newValues = {$set: {loss: count}};
                    Info.Info.updateOne(query, newValues, function(err, res){
                        if(err) throw err;
                        //console.log('User data: loss + 1')
                    })
            }
        })
}

//calculate Statistics for Profile page
function calculateRank() {
    var wins = userdata[0].win;
    var loss = userdata[0].loss;
    var rank = [];

    if (wins >= 20) {
        //this is the highest rank
        rank.push("master")
        rank.push("Highest Rank!")
        rank.push(0)
    }
    else if (wins >= 15) {
        //curr rank
        rank.push("diamond")
        //next rank
        rank.push("master")
        //games to rank up
        rank.push(20 - wins)
    }
    else if (wins >= 10) {
        rank.push("gold")
        rank.push("diamond")
        rank.push(15 - wins)
    }
    else if (wins >= 5) {
        rank.push("silver")
        rank.push("gold")
        rank.push(10 - wins)
    }
    else {
        //lowest rank
        rank.push("bronze")
        rank.push("silver")
        rank.push(5 - wins)
    }
    //total games played
    rank.push(wins+loss)
    return rank
}

//Update user password in database
function updatePassword(usertoFind, currPassword, newPassword, response) {

    Info.Info.find({ username: usertoFind }).then(
        function (results) {
            //check agains current password
            //console.log(results[0])
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

//update userdata variable with current user info
function getUserData(usertoFind) {
    Info.Info.find({ username: usertoFind }).then(
        function (results) {
            userdata = results;
        }
    )
}

//View Render

//Show database content (DEBUG only)
app.get('/all-infos', (req, res) => {
    Info.Info.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
})

//render home page
app.get('/', function (request, response) {
    
    response.render("home"
    ,{
        data: JSON.stringify(userdata),
        auth: authorized
     }
    );
});


//render game page
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

//Post game result handle
app.post('/game/win', (req, res) => {
    // you have address available in req.body:
    //console.log("Game win Request received: " + req.body.username + " with " + req.body.userWin);
    updateGame(req.body.username, req.body.userWin);
    // always send a response:
    res.json({ ok: true });
});

//render Register page
app.get('/register', function (req, response) {
    response.render("register",{
        title: "register page"
    });
});

//Register account handle
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
                    title: 'Register',
                    errorMessage: 'register successfully',
                    username: username
                })
            }
        })
    })
});

//render login page
app.get('/login', function(req, res){
    res.render('login',{
        title: "",
        auth: authorized
    });
});

//login handle
app.post('/login', function (request, res) {
    //Check the login info form database.
    //console.log(request.body);
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
            res.redirect('/');
        } else {
            res.render('login', {
                title: "Login page",
                errorMessage: "Login failed please try agian!!"
            });
        }

    }).catch(error => {
        res.render('login', {
            title: "Login page",
            errorMessage: "Login failed please try again!!"
        });
    });
});

//logout curr user
app.get('/logout', function (request, response) {
    userdata = {};
    authorized = false;
    response.render("home"
        , {
            title: "Player!!!",
            data: JSON.stringify(userdata),
            auth: authorized
        }
    );
});

//render profile page
app.get('/profile', function (request, response) {
    if (Object.keys(userdata).length > 0) {
        //update userdata to account for newly addition
        getUserData(userdata[0].username)
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

//profile password update handle
app.post('/profile', function (request, res) {
    let currPassword = request.body.currPassword;
    let newPassword = request.body.newPassword;
    //console.log("Password Change called: currPW=" + currPassword + " newPW=" + newPassword);
    updatePassword(userdata[0].username, currPassword, newPassword,res);
    
});

//render guide page
app.get('/guide', function (request, response) {
    response.render("guide"
        , {
            data: userdata[0],
            auth: authorized
        }
    );
});

//render rank page
app.get('/rank', function (request, response) {
    Info.Info.find()
        .then((result) => {
            var userArr = [];
            //parse user data
            for (const user of result) {
                var userData = {};
                userData.name = user.username
                userData.point = user.win
                userArr.push(userData)

            }
            userArr.sort((a, b) => { return b.point - a.point});
            response.render("rank"
                , {
                    data: JSON.stringify(userArr),
                    auth: authorized
                }
            );
        })
        .catch((err) => {
            console.log(err);
            response.render("error"
                , {
                    message: "Ranking data not found"
                }
            );
        });
    
});

//port setup
app.set('port', process.env.PORT || 3000);

//starting server
app.listen(app.get('port'), function () {
    console.log(`Server Started (localhost:${app.get('port')})`);
});