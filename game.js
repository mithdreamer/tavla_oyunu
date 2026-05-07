const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

let currentPlayer = "W";
let selectedPoint = null;
let diceValues = [];

let boardWidth, boardHeight;

const board = Array(24).fill().map(()=>[]);

function resizeCanvas(){
    boardWidth = canvas.clientWidth;
    boardHeight = canvas.clientHeight;

    canvas.width = boardWidth;
    canvas.height = boardHeight;

    redraw();
}

function initBoard(){

    board[23] = ["W","W"];
    board[12] = ["W","W","W","W","W"];
    board[7] = ["W","W","W"];
    board[5] = ["W","W","W","W","W"];

    board[0] = ["B","B"];
    board[11] = ["B","B","B","B","B"];
    board[16] = ["B","B","B"];
    board[18] = ["B","B","B","B","B"];
}

function drawBoard(){

    const boardW = boardWidth;
    const boardH = boardHeight;

    const barW = boardW * 0.05;
    const sideW = (boardW - barW) / 2;
    const triW = sideW / 6;
    const triH = boardH * 0.42;

    ctx.clearRect(0,0,boardW,boardH);

    let gradient = ctx.createLinearGradient(0,0,boardW,boardH);
    gradient.addColorStop(0,"#d2a679");
    gradient.addColorStop(1,"#b07a3a");

    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,boardW,boardH);

    ctx.fillStyle = "#5a3e1b";
    ctx.fillRect(sideW,0,barW,boardH);

    // ALT
    for(let i=0;i<12;i++){

        let x;

        if(i < 6){
            x = i * triW;
        } else {
            x = sideW + barW + (i-6)*triW;
        }

        ctx.beginPath();
        ctx.moveTo(x,boardH);
        ctx.lineTo(x+triW,boardH);
        ctx.lineTo(x+triW/2,boardH - triH);

        ctx.fillStyle = i%2===0 ? "#8b0000" : "#f5deb3";
        ctx.fill();
    }

    // ÜST
    for(let i=0;i<12;i++){

        let x;

        if(i < 6){
            x = sideW - (i+1)*triW;
        } else {
            x = boardW - (i-5)*triW;
        }

        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x+triW,0);
        ctx.lineTo(x+triW/2,triH);

        ctx.fillStyle = i%2===0 ? "#f5deb3" : "#8b0000";
        ctx.fill();
    }
}

function pointToXY(point, level){

    const boardW = boardWidth;
    const boardH = boardHeight;

    const barW = boardW * 0.05;
    const sideW = (boardW - barW) / 2;
    const triW = sideW / 6;
    const triH = boardH * 0.42;

    const xOffset = triW / 2;
    const marginY = triH * 0.1;
    const yStep = (triH - marginY) / 5;

    let x;

    if(point <= 11){
        let idx = 11 - point;

        if(idx < 6){
            x = idx * triW + xOffset;
        } else {
            x = sideW + barW + (idx-6)*triW + xOffset;
        }
    } else {
        let idx = point - 12;

        if(idx < 6){
            x = sideW - (idx+1)*triW + xOffset;
        } else {
            x = boardW - (idx-5)*triW + xOffset;
        }
    }

    let y;

    if(point <= 11){
        y = boardH - marginY - level * yStep;
    } else {
        y = marginY + level * yStep;
    }

    return {x,y};
}

function drawCheckers(){

    const checkerR = Math.min(boardWidth, boardHeight) * 0.025;

    for(let p=0;p<24;p++){

        for(let i=0;i<board[p].length;i++){

            let c = board[p][i];
            let pos = pointToXY(p,i);

            ctx.beginPath();
            ctx.arc(pos.x,pos.y,checkerR,0,Math.PI*2);

            ctx.fillStyle = c==="W" ? "white" : "black";
            ctx.fill();

            ctx.strokeStyle="#333";
            ctx.lineWidth=2;
            ctx.stroke();
        }
    }
}

function redraw(){
    drawBoard();
    drawCheckers();
}

function rollDice(){
    let d1 = Math.floor(Math.random()*6)+1;
    let d2 = Math.floor(Math.random()*6)+1;

    diceValues = d1===d2 ? [d1,d1,d1,d1] : [d1,d2];

    setStatus("Zar: " + d1 + " - " + d2);
}

function setStatus(text){
    document.getElementById("status").innerText=text;
}

function resetGame(){

    for(let i=0;i<24;i++) board[i]=[];

    initBoard();
    selectedPoint=null;
    diceValues=[];
    currentPlayer="W";

    redraw();
}

initBoard();
resizeCanvas();
window.addEventListener("resize", resizeCanvas);