# GOMOKU Game (Final Project) 

| Group Member Name | GitHub Username (GitHub URL)|
| :------------------------:|:--------------------------------------:|
| Zikun Fu | [ZikunFu](https://github.com/ZikunFu) |
| Chen Yang | [ChenYang-OTU](https://github.com/ChenYang-OTU) |
| Chen Yang | [xsyyyccc](https://github.com/xsyyyccc) |
| Yanguang Yang | [Yanguang-Yang](https://github.com/Yanguang-Yang) |

Note: Chen Yang participates with "ChenYang-OTU" and commits and pushes code as "xsyyyccc"

## Description

GoMoKu Game is a strategy board game. It is played on Go pieces (black and white) on the Go board. The victory condition are defined by "if 5 go pieces are in the same row/ column/diagonal". In this final project we made, we achieved all the conditions that a game should have including rank, profile, changing and saving password, login, register, and guide linked to youtube videos with api.

## Independent Study
* YouTube API Integration
* Implemented in Guide page
* See the following PDF: https://github.com/ZikunFu/WebDev-FinalProject/blob/master/Independent_Study_Presentation.pdf

## Getting Started 
### Database Setup
Our database is hosted on cloud [MongoDB Atlas](https://www.mongodb.com/atlas/database)<br/>

Exsisting Sample data in database:
| _id                      | username | password   | win | loss | createdAt                | updatedAt                |
|--------------------------|----------|------------|-----|------|--------------------------|--------------------------|
| 62608e60fc8173653c310382 | xsyyyccc | jas8324938 | 1   | 0    | 2022-04-20T22:51:12.043Z | 2022-04-20T22:51:12.043Z |
| 6260930097841aa337b91673 | mikeJ    | MiK000111  | 6   | 3    | 2022-04-20T23:10:56.302Z | 2022-04-20T23:10:56.302Z |
| 6266f362b2f043414b59e3e8 | FuZiKun  | 123456     | 4   | 0    | 2022-04-25T19:15:46.375Z | 2022-04-27T13:56:12.768Z |
| 6266fab52e2d78729fd2a387 | 1        | 123        | 20  | 0    | 2022-04-25T19:47:01.471Z | 2022-04-27T15:19:09.413Z |
| 62694c94fe9cfb660ed8a1de | Cypher   | 457597152  | 7   | 3    | 2022-04-27T14:00:52.416Z | 2022-04-27T14:00:52.416Z |
| 62694cb2b9ab666295ed4143 | Reyna    | 775348114  | 10  | 9    | 2022-04-27T14:01:22.460Z | 2022-04-27T14:01:22.460Z |
| 62694ccca0747a2d7ab96791 | Chris    | 125874     | 16  | 1    | 2022-04-27T14:01:48.013Z | 2022-04-27T14:01:48.013Z |
| 62695d9e592f35615d0e99e8 | testuser | testuser   | 0   | 0    | 2022-04-27T15:13:34.052Z | 2022-04-27T15:13:34.052Z |
| 62695e2a44c950cfcd88482d | test2    | test       | 0   | 0    | 2022-04-27T15:15:54.729Z | 2022-04-27T15:15:54.729Z |

The following function make addition to the database
```
app.get('/add-info', (req,res)=>{
    const info = new Info({
        username: 'mikeJ',
        password: 'MiK000111',
        win: 6,
        loss: 3
    });

    info.save()
        .then((result)=>{
            res.send(result)
        })
        .catch((err)=>{
            console.log(err);
        });
});
```
This debug page shows all content in the database
```
localhost:$port/all-infos
```

### Dependencies

* Node.js
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
Server Started(Port=...)
mangoDB connected
```
* port is set to your system ENVS variable
* You should Register/Login before accessing the Game and Profile page
* However, Guide/Rank page do not require Login

## Game Help

* Fill your Go(white piece or Black piece) pieces. Win condition is to fill 5 consecutive peices in a row or column or diagonal
* You can change the difficulty and other settings for the game in game page
* Your win and loss will be recorded and saved into the database, you could see al user information in the profile page
* If you want to know what place you are you could go check Rank, it shows the Top Three placements all player scores

## Authors

Contributors names and contact info

* Chen Yang xsyyyccc@gmail.com
* Zikun Fu zikun.fu@ontariotechu.net
* Yanguang Yang yanguang.yang@ontariotechu.net
