var variable = {
    number: [],      //记录每个格子中的数字
    score: 0        //得分
};

$(function(){
    newGame();
    moveHandler();
    $("#newGameBtn").click(function(event) {
        newGame();
    });
})

//新游戏
function newGame() {
    $("#prompt").hide()
    initGrids();
    rand();
    rand();
    numCellHandler();
}

//初始化格子
function initGrids() {
    for(var i = 0; i < 4; i++) {
        for(var j = 0; j < 4; j++){
            var cell = $('#cell-' + i + '-' + j);
            cell.css({top:getPos(i),left:getPos(j)});
        }
        variable.number[i] = [0, 0, 0, 0];
    }
    showScore();
}

function showScore() {
    $(".score").text(variable.score);
}

//计算位置
function getPos(x) {
    return 20 + x*120;
}

//处理每个cell
function numCellHandler() {
    for(var i = 0; i < 4; i++) {
        for(var j = 0; j < 4; j++) {
            $("#grids").append('<div class="numCell" id="numCell-'+ i +'-'+ j +'"></div>');
            var numCell = $('#numCell-'+ i +'-'+ j);
            if (variable.number[i][j] == 0) {
                numCell.css({
                    width:'0px',
                    height:'0px',
                    top:getPos(i),
                    left:getPos(j)
                });
                numCell.text("");
            } else {
                numCell.css({
                    width:'100px',
                    height:'100px',
                    top:getPos(i),
                    left:getPos(j),
                    backgroundColor: getBackGroundColor(variable.number[i][j]),
                    color: getColor(variable.number[i][j]),
                });
                numCell.text(variable.number[i][j]);
            }
        }
    }
    showScore();
    if (isOver()) {
        setTimeout("$('#prompt').fadeIn().text('Game Over!')", 200);

    }
    if (isWin()) {
        setTimeout("$('#prompt').fadeIn().text('You Win!')", 200);
    }
}

//获取背景颜色
function getBackGroundColor(num) {
    switch (num) {
        case 2: return "#eee4da"; break;
        case 4: return "#ede0c8"; break;
        case 8: return "#f2b179"; break;
        case 16: return "#f59563"; break;
        case 32: return "#f67c5f"; break;
        case 64: return "#f65e3b"; break;
        case 128: return "#edcf72"; break;
        case 256: return "#edcc61"; break;
        case 512: return "#9c0"; break;
        case 1024: return "#33b5e5"; break;
        case 2048: return "#09c"; break;
        case 4096: return "#a6c"; break;
        case 8192: return "#93c"; break;
    }
}

//获取文字颜色
function getColor(num) {
    if (num <= 4) {
        return "#776e65"
    }
    return "white";
}

//产生新cell
function rand() {
    var randNum = Math.random() > 0.2 ? 2 : 4;
    var randX = Math.floor(Math.random() * 4);
    var randY = Math.floor(Math.random() * 4);
    while(true){
        if(variable.number[randX][randY] == 0){
            break;
        }else{
            var randX = Math.floor(Math.random() * 4);
            var randY = Math.floor(Math.random() * 4);
        }
    }
    variable.number[randX][randY] = randNum;
}

//处理键盘事件
function moveHandler() {
    $(document).keydown(function(event) {
        switch (event.keyCode) {
            case 37:        //left
                if(canLeft()) {
                    moveLeft();
                    setTimeout("rand()", 200);
                }
                break;
            case 38:        //up
                if (canUp()) {
                    moveUp();
                    setTimeout("rand()", 200);
                }
                break;
            case 39:        //right
                if (canRight()) {
                    moveRight();
                    setTimeout("rand()", 200);
                }
                break;
            case 40:        //down
                if (canDown()) {
                    moveDown();
                    setTimeout("rand()", 200);
                }
                break;
            default:
                break;
        }
        setTimeout("numCellHandler()",200);
    });

}

//是否可以左移，左边cell为0或相等则可左移
function canLeft() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (variable.number[i][j] != 0 && j > 0) {
                if (variable.number[i][j-1] == 0 || variable.number[i][j] == variable.number[i][j-1]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canUp() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (variable.number[i][j] != 0 && i > 0) {
                if (variable.number[i-1][j] == 0 || variable.number[i][j] == variable.number[i-1][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canRight() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (variable.number[i][j] != 0 && j < 3) {
                if (variable.number[i][j+1] == 0 || variable.number[i][j] == variable.number[i][j+1]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canDown() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (variable.number[i][j] != 0 && i < 3) {
                if (variable.number[i+1][j] == 0 || variable.number[i][j] == variable.number[i+1][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

//左移，从最左侧格子开始计算，若为0，则找到自身右边第一个非0元素nextRight，将自身的值改为nextRight，另nextRight = 0
//j--以便下次循环j不变，看能否合并；
//若不为0，且nextRight相等则可合并
function moveLeft() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 3; j++) {
            var nextCol = getNextRight(i,j);
            if (nextCol == -1) {
                break;
            } else {
                if (variable.number[i][j] == 0) {
                    moveAnimation(i, nextCol, i, j);
                    variable.number[i][j] = variable.number[i][nextCol];
                    variable.number[i][nextCol] = 0;
                    j--;
                } else if (variable.number[i][j] == variable.number[i][nextCol]) {
                    moveAnimation(i, nextCol, i, j);
                    variable.number[i][j] *= 2;
                    variable.score += variable.number[i][j];
                    variable.number[i][nextCol] = 0;
                }
            }
        }
    }
}

function getNextRight(row, col) {
    for (var i = col + 1; i < 4; i++) {
        if (variable.number[row][i] != 0) {
            return i;
        }
    }
    return -1;
}

function moveUp() {
    for (var j = 0; j < 4; j++) {
        for (var i = 0; i < 3; i++) {
            var nextRow = getNextDown(i,j);
            if (nextRow == -1) {
                break;
            } else {
                if (variable.number[i][j] == 0) {
                    moveAnimation(nextRow, j, i, j);
                    variable.number[i][j] = variable.number[nextRow][j];
                    variable.number[nextRow][j] = 0;
                    i--;
                } else if (variable.number[i][j] == variable.number[nextRow][j]) {
                    moveAnimation(nextRow, j, i, j);
                    variable.number[i][j] *= 2;
                    variable.score += variable.number[i][j];
                    variable.number[nextRow][j] = 0;
                }
            }
        }
    }
}

function getNextDown(row, col) {
    for (var i = row + 1; i < 4; i++) {
		if (variable.number[i][col] !=0 ) {
			return i;
		}
	}
	return -1;
}

function moveRight() {
    for (var i = 0; i < 4; i++) {
        for (var j = 3; j > 0; j--) {
            var nextCol = getNextLeft(i,j);
            if (nextCol == -1) {
                break;
            } else {
                if (variable.number[i][j] == 0) {
                    moveAnimation(i, nextCol, i, j);
                    variable.number[i][j] = variable.number[i][nextCol];
                    variable.number[i][nextCol] = 0;
                    j++;
                } else if (variable.number[i][j] == variable.number[i][nextCol]) {
                    moveAnimation(i, nextCol, i, j);
                    variable.number[i][j] *= 2;
                    variable.score += variable.number[i][j];
                    variable.number[i][nextCol] = 0;
                }
            }
        }
    }
}

function getNextLeft(row, col) {
    for (var i = col - 1; i >= 0; i--) {
        if (variable.number[row][i] != 0) {
            return i;
        }
    }
    return -1;
}

function moveDown() {
    for (var j = 0; j < 4; j++) {
        for (var i = 3; i > 0; i--) {
            var nextRow = getNextUp(i,j);
            if (nextRow == -1) {
                break;
            } else {
                if (variable.number[i][j] == 0) {
                    moveAnimation(nextRow, j, i, j);
                    variable.number[i][j] = variable.number[nextRow][j];
                    variable.number[nextRow][j] = 0;
                    i++;
                } else if (variable.number[i][j] == variable.number[nextRow][j]) {
                    moveAnimation(nextRow, j, i, j);
                    variable.number[i][j] *= 2;
                    variable.score += variable.number[i][j];
                    variable.number[nextRow][j] = 0;
                }
            }
        }
    }
}

function getNextUp(row, col) {
    for(var i = row - 1; i >= 0; i--) {
        if (variable.number[i][col] != 0) {
            return i;
        }
    }
    return -1;
}

function moveAnimation(fromx, fromy, tox, toy) {
    var numCell = $('#numCell-' + fromx + '-' + fromy);
    numCell.animate({
       top :getPos(tox),
       left:getPos(toy)
   },150);
}

function isFull() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (variable.number[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

//判断每个元素右侧和下侧是否有相等元素，没有则over
function isOver() {
    if (isFull()) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {       //判断下方
                if (i < 3) {
                    if (variable.number[i][j] == variable.number[i+1][j]) {
                        return false;
                    }
                }
                if (j < 3) {        //判断右方
                    if (variable.number[i][j] == variable.number[i][j+1]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    return false;
}

function isWin() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (variable.number[i][j] == 2048) {
                return true;
            }
        }
    }
    return false;
}
