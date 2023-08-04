const cells=document.querySelectorAll('.cell');
const playerTurn=document.querySelector('.turn');
const playerFirst='X';
const playerSecond='O';
const origBoard=Array(9);
const winCombinations=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

const minimax=(newBoard,player)=>{
    const emptyCells=returnEmptyCells(newBoard);
    if(checkWin(newBoard,playerFirst)){
        return {
            score:-1
        };
    }
    else if(checkWin(newBoard,playerSecond)){
        return {
            score:1
        };
    }
    else if(emptyCells.length===0){
        return {
            score:0
        };
    }
    const moves=[];
    for(let i=0; i<emptyCells.length; i++) {
        let move = {};
        move.index = newBoard[emptyCells[i]];
        newBoard[emptyCells[i]] = player;
        if (player == playerFirst) {
            let result = minimax(newBoard, playerSecond);
            move.score = result.score;
        }
        else if(player == playerSecond){
            let result = minimax(newBoard, playerFirst);
            move.score = result.score;
        }
        newBoard[emptyCells[i]] = move.index;
        moves.push(move);
    }
    let bestMove;
    if(player==playerFirst){
        let bestScore=100;
        for(let i=0; i<moves.length; i++){
            if(bestScore>moves[i].score) {
                bestMove = i;
                bestScore = moves[i].score;
            }
        }
    }
    else{
        let bestScore=-100;
        for(let i=0; i<moves.length; i++){
            if(bestScore<moves[i].score) {
                bestMove = i;
                bestScore = moves[i].score;
            }
        }
    }
    return moves[bestMove];
}

const returnEmptyCells=(board)=>{
    const ans=board.filter((s)=>{
        return typeof(s)==='number';
    });
    return ans;
}
const bestPlace=(board)=>{
    return minimax(board,playerSecond).index;
}
const checkTie=(board)=>{
   if(returnEmptyCells(board).length===0){
       board.forEach((elem,index)=>{
           document.getElementById(index).style.background='green';
       })
       cells.forEach((elem)=>{
           elem.removeEventListener('click',doClick);
       })
       return 1;
   }
   else return 0;
}

const gameOver=(winner)=>{
    winCombinations[winner.index].forEach(elem=>{
        document.getElementById(elem).style.background=(winner.player==playerFirst ? "blue" : "red");
    })
    cells.forEach(elem=>{
        elem.removeEventListener('click',doClick);
    })
}
const checkWin=(board,player)=>{
    let gameWon=null;
    winCombinations.forEach((elem,index)=>{
        if(board[elem[0]]===board[elem[1]] && board[elem[1]]===board[elem[2]] && board[elem[0]]===player){
            gameWon={player: player, index: index};
        }
    })
    return gameWon;
}
const turn=(id,player)=>{
    origBoard[id]=player;
    document.getElementById(id).innerHTML=player;
    const won=checkWin(origBoard,player);
    if(won) gameOver(won);
}
const doClick=(e)=>{
    if(typeof origBoard[e.target.id]==='number') {
        turn(e.target.id, playerFirst);
        if (!checkTie(origBoard) && !checkWin(origBoard,playerFirst)) turn(bestPlace(origBoard), playerSecond);
    }
}
const startGame=()=>{
    document.querySelector('.endgame').style.display="none";
    for(let i=0; i<9; i++){
        origBoard[i]=i;
    }
    cells.forEach((elem,index)=>{
        elem.innerHTML='';
        elem.style.background='inherit';
        elem.addEventListener('click',doClick);
    })
}
startGame();


