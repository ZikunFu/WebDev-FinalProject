var vBoard
var difficulty = "Easy"
var playerColor = "black"
var npcColor = "white"
//user is defined in pug
const username = user.username;
$(document).ready(function () {
    let board = $('#board');
    vBoard = generateTable(board);
})

//pre game settings
$('#settings').submit(function (event) {
    event.preventDefault()
    difficulty = $('#difficulty').val();
    playerColor = $('#playerColor').val();
    npcColor = $('#npcColor').val();
    console.log("playercolor is set to " + playerColor);
    console.log("npcColor is set to " + npcColor);
    console.log("difficulty is set to" + difficulty);
    
});

//essential functions

//display winning message
function resolveComplete(playerWin) {
    if (playerWin = true) {
        addWin(true)
        alert("Player Win! Your win count has been updated! Click confirm to start new game")
        location.reload();
    }
    else {
        addWin(false)
        alert("NPC Win! Your loss count has been updated. Click confirm to start new game")
        location.reload();
    }
}

//transfer win data back to server
function addWin(isUserWin) {
    var dataToSend = {}
    dataToSend["username"] = username;

    dataToSend["userWin"] = isUserWin;
 
    console.log(dataToSend)
    $.post('/game/win', dataToSend);
}

//monitor user input on board
var userMoveID
function boardOnClick() {
    var selected_id = $(this).attr('id');
    var selected_row = selected_id[0];
    var selected_col = selected_id[1];
    
    //var selected_value = $(this).text();

    //check if cell empty
    if (vBoard[selected_row][selected_col] != ' ') {
        alert("This spot is taken");
    }
    else {
        userMoveID = '' + selected_row + selected_col
        

        if (playerColor == "black") {
            $(this).append(img_blackPiece());
        }
        else {
            $(this).append(img_whitePiece());
        }
        //Replace vBoard
        vBoard[selected_row][selected_col] = playerColor;
        if (checkWin(userMoveID)==true) {
            //alert(vBoard[selected_row][selected_col] + " win")
            resolveComplete(true)
        }

        let npcMoveID = npcMove(board, vBoard)
        if (checkWin(npcMoveID) == true) {
            //alert(vBoard[npcMoveID[0]][npcMoveID[1]] + " win")
            resolveComplete(false)
        }
    }

}
function getRandomInt(min, max) {
    if (min < 0) {
        min=0
    }
    if (max >= vBoard.length) {
        max = vBoard.length-1
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function npc_easy_move() {
    while (true) {
        let row = getRandomInt(0, vBoard.length - 1)
        let col = getRandomInt(0, vBoard[0].length - 1)
        //console.log("row = " + row + " col = " + col)
        //console.log("vboard = " + vBoard[row][col])
        let id = '' + row + col

        if (vBoard[row][col] == ' ') {
            //console.log("inserting into " + id)
            if (npcColor == "black") {
                getCell(id).append(img_blackPiece())
            }
            else {
                getCell(id).append(img_whitePiece())
            }
            
            vBoard[row][col] = npcColor;
            return id
        }
        else {
            console.log("position occupied, randomizing new id")
        }

    }
}

function npc_medium_move() {
    user_move_row = parseInt(userMoveID[0])
    user_move_col = parseInt(userMoveID[1])

    let npc_move_row = getRandomInt(user_move_row - 1, user_move_row + 1)
    let npc_move_col = getRandomInt(user_move_col - 1, user_move_col + 1)
    var count = 0


    while (!validMove(npc_move_row, npc_move_col)) {
        npc_move_row = getRandomInt(user_move_row - 1, user_move_row + 1)
        npc_move_col = getRandomInt(user_move_col - 1, user_move_col + 1)
        count += 1
        //if all possible move are occupied, choose random position
        if (count >= 10) {
            return npc_easy_move()
        }
    }
    id = '' + npc_move_row + npc_move_col;

    //npc make move
    getCell(id).append(img_whitePiece())
    vBoard[npc_move_row][npc_move_col] = npcColor
    return id
}

function npcMove() {
    var moveID
    if (difficulty == "Easy") {
        moveID = npc_easy_move()
    }
    else if (difficulty == "Medium") {
        moveID = npc_medium_move()
    }
    //else if (difficulty == "Hard") {

    //}
    else {
        console.log("error: difficulty value is not recognized (" + difficulty+")")
    }
    return moveID

}

function validMove(row,col) {
    if (vBoard[row][col] == ' ') {
        return true
    }
    else {
        return false
    }
}

function generateTable(board) {
    //fill board table
    for (let row = 0; row <= 8; row++) {
        let tr = $('<tr>');
        for (let col = 0; col <= 8; col++) {
            let data = $('<td>');
            data.text(' ');
            data.attr('id', '' + row + col);
            data.click(boardOnClick)
            tr.append(data);

        }
        board.append(tr);

    }

    //create 2d array of board for check purposes
    var vBoard = new Array(9);
    for (var i = 0; i < vBoard.length; i++) {
        vBoard[i] = new Array(9)
    }

    for (var row = 0; row < vBoard.length; row++) {
        for (var col = 0; col < vBoard[row].length; col++) {
            vBoard[row][col] = ' ';
        }
    }
    //return virtual board
    return vBoard
}

//check if selected color is won
function checkWin(targetID) {
    let row = parseInt(targetID[0])
    let col = parseInt(targetID[1])
    var color = vBoard[row][col]

    if (checkTop(color, row, col) + checkBottom(color, row, col) >= 6) {
        console.log("1")
        return true
    }
    else if (checkLeft(color, row, col) + checkRight(color, row, col) >= 6) {
        console.log("2")
        return true
    }
    else if (checkTopRight(color, row, col) + checkBottomLeft(color, row, col) >= 6) {
        console.log("3")
        return true
    }
    else if (checkTopLeft(color, row, col) + checkBottomRight(color, row, col) >= 6) {
        console.log("4")
        return true
    }
    else {
        return false
    }
} 

function checkTop(color, row, col) {
    let count = 0
    //console.log("Targeted ID is: "+row+col)
    for (let i = row; i >= 0; i--) {
        //console.log("checking "+i+col)
        if (vBoard[i][col] == color) {
            //console.log("found "+color)
            count += 1;
        }
        else {
            break;
        }
    }
    return count;
}
function checkBottom(color, row, col) {
    let count = 0
    for (let i = row; i < vBoard.length; i++) {
        if (vBoard[i][col] == color) {
            count += 1;
        }
        else {
            break;
        }
    }
    return count;
}

function checkLeft(color, row, col) {
    let count = 0
    //console.log("Targeted ID is: " + row + col)
    for (let i = col; i >= 0; i--) {
        //console.log("checking " + i + col)
        if (vBoard[row][i] == color) {
            //console.log("found " + color)
            count += 1;
        }
        else {
            break;
        }
    }
    return count;
}
function checkRight(color, row, col) {
    let count = 0
    for (let i = col; i < vBoard.length; i++) {
        if (vBoard[row][i] == color) {
            count += 1;
        }
        else {
            break;
        }
    }
    return count;
}

//diagonal checker
function checkTopRight(color, row, col) {
    let count = 0;
    //console.log("Targeted ID is: " + row + col)
    while (row >= 0 && col <= vBoard.length) {
        
        //console.log("checking " + row + col)
        if (vBoard[row][col] == color) {
            //console.log("found " + color)
            count += 1;
        }
        row -= 1;
        col += 1;
        
    }
    return count;
}
function checkBottomLeft(color, row, col) {
    let count = 0;
    //console.log("Targeted ID is: " + row + col)
    while (row < vBoard.length && col > 0) {
        //console.log("checking " + row + col)
        //getCell('' + row + col).css("background-color", "red")
        if (vBoard[row][col] == color) {

            count += 1;
        }
        row += 1;
        col -= 1;
    }
    return count;
}

function checkTopLeft(color, row, col) {
    let count = 0;
    //console.log("Targeted ID is: " + row + col)
    while (row >= 0 && col <= vBoard.length) {
        //getCell(''+row+col).css("background-color","red")
        //console.log("checking " + row + col)
        if (vBoard[row][col] == color) {
            //console.log("found " + color)
            count += 1;
        }
        row -= 1;
        col -= 1;

    }
    return count;
}
function checkBottomRight(color, row, col) {
    let count = 0;
    //console.log("Targeted ID is: " + row + col)
    while (row < vBoard.length && col < vBoard.length) {
        //getCell('' + row + col).css("background-color", "red")
        //console.log("checking " + row + col)
        if (vBoard[row][col] == color) {
            //console.log("found " + color)
            count += 1;
        }
        row += 1;
        col += 1;

    }
    return count;
}




//helper function

//return cell by its position
function getCell(id) {
    return $("[id=" + id + "]")
}

//return chess piece image
function img_blackPiece() {
    let img = '<img src="images/black.png" style="width:40px;height:auto;text-align:center;">';
    return img;
}

function img_whitePiece() {
    let img = '<img src="images/white.png" style="width:40px;height:auto;text-align:center;">';
    return img;
}