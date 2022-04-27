# GOMOKU Game (Final Project) 

| Group Member Name | GitHub Username (GitHub URL)|
| :------------------------:|:--------------------------------------:|
| Zikun Fu | [ZikunFu](https://github.com/ZikunFu) |
| Chen Yang | [ChenYang-OTU](https://github.com/ChenYang-OTU) |
| Chen Yang | [xsyyyccc](https://github.com/xsyyyccc) |
| Yanguang Yang | [Yanguang-Yang](https://github.com/Yanguang-Yang) |

note: Chen Yang participates with "ChenYang-OTU" and commits and pushes code as "xsyyyccc"

## Description

GoMoKu Game is a strategy board game. It is played on Go pieces (black and white) on the Go board. The victory condition are defined by "if 5 go pieces are in the sae row/ column/diagonal". In this final project we made, we achieved all the conditions that a game should have including rank, profile, changing and saving password, login, register, and guide linked to youtube videos with api.

## Getting Started

note: we don't allow users to modify the database since it is an online game, however, you can use the function in app.js
```
app.get('/add-info', (req,res) =>{...}
```
to add more sample data to the database
if you want to see all the data in the database, please visit 
```
localhost:$port/all-infos
```

### Dependencies

* Windows 10
* Express
* Mongoose

### Installing

* running cmd and type
```
npm install express -g
npm install mongoose -g
```

### Executing program

* open cmd and type following command line to to visit the folder you pulled from github
```
cd "your local path"\WebDev-FinalProject
```
* in the cmd then type
```
node app.js
```
* you can get following result
```
mangoDB connected
```
* get your own port
* in the browers, visit localhost/$port
* you could login and register on your top left hand side, click register to create an account
* then go to login to login in to the games
* once it said login successfully, go back to home and play the game

## Game Help

* Fill your Go(white piece or Black piece) pieces in a row or column or diagonal with 5 numbers, you win the game
* Your win and loss will be recorded and saved into the database, you could clearly see that in your profile
* If you want to know what place you are you could go check Rank, it shows the first three placements and your current rank

## Authors

Contributors names and contact info

* Chen Yang xsyyyccc@gmail.com
* Zikun Fu zikun.fu@ontariotechu.net
* Yanguang Yang yanguang.yang@ontariotechu.net
