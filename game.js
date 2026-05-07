const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

let currentPlayer = "W";

let selectedPoint = null;

let diceValues = [];

let boardWidth = canvas.clientWidth;
let boardHeight = canvas.clientHeight;

const board = Array(24).fill().map(()=>[]);

function resizeCanvas(){
    const rect = canvas.getBoundingClientRect();
    if(rect.width === 0 || rect.height === 0)
        return;

    boardWidth = rect.width;
    boardHeight = rect.height;

    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.round(boardWidth * scale);
    canvas.height = Math.round(boardHeight * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

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
    const barW = boardW * 0.044;
    const triW = (boardW - barW) / 12;
    const triH = boardH * 0.366;

    ctx.clearRect(0,0,boardW,boardH);

    ctx.fillStyle = "#d9b97a";
    ctx.fillRect(0,0,boardW,boardH);

    ctx.fillStyle = "#704b1b";
    ctx.fillRect((boardW - barW) / 2,0,barW,boardH);

    // Alt kısım sol üçgenler (point 0-11)
    for(let i=0;i<12;i++){

        let x = i * triW;

        ctx.beginPath();

        ctx.moveTo(x,boardH);
        ctx.lineTo(x+triW,boardH);
        ctx.lineTo(x+triW/2,boardH - triH);

        ctx.fillStyle =
            i%2===0 ? "#6d4c41" : "#a55f22";

        ctx.fill();
    }

    // Üst kısım sağ üçgenler (point 12-23)
    for(let i=0;i<12;i++){

        let x = boardW - (i+1) * triW;

        ctx.beginPath();

        ctx.moveTo(x,0);
        ctx.lineTo(x+triW,0);
        ctx.lineTo(x+triW/2,triH);

        ctx.fillStyle =
            i%2===0 ? "#a55f22" : "#6d4c41";

        ctx.fill();
    }
}

function pointToXY(point, level){

    const boardW = boardWidth;
    const boardH = boardHeight;
    const barW = boardW * 0.044;
    const triW = (boardW - barW) / 12;
    const triH = boardH * 0.366;
    const xOffset = triW / 2;
    const marginY = triH * 0.1;
    const availableH = triH - marginY;
    const yStep = availableH / 5; // max 5 levels

    let displayIndex =
        point <=11 ? 11-point : point-12;

    let x;

    if(point <=11){
        x = displayIndex * triW + xOffset;
    }else{
        x = boardW - (displayIndex + 1) * triW + xOffset;
    }

    let y;

    if(point<=11){
        // Alt üçgen: tabandan tepeye
        y = boardH - marginY - level * yStep;
    }else{
        // Üst üçgen: tabandan tepeye
        y = marginY + level * yStep;
    }

    return {x,y};
}

function drawCheckers(){

    const checkerR = Math.min(boardWidth, boardHeight) * 0.02;

    for(let p=0;p<24;p++){

        for(let i=0;i<board[p].length;i++){

            let c = board[p][i];

            let pos = pointToXY(p,i);

            ctx.beginPath();

            ctx.arc(pos.x,pos.y,checkerR,0,Math.PI*2);

            ctx.fillStyle =
                c==="W" ? "white" : "black";

            ctx.fill();

            ctx.strokeStyle="#333";
            ctx.lineWidth=2;
            ctx.stroke();

            if(selectedPoint===p){

                ctx.strokeStyle="cyan";
                ctx.lineWidth=4;
                ctx.stroke();
            }
        }
    }
}

function redraw(){

    drawBoard();
    drawCheckers();
}

function rollDice(){

    if(diceValues.length>0){

        setStatus("Önce mevcut hamleyi yap.");
        return;
    }

    let d1 =
        Math.floor(Math.random()*6)+1;

    let d2 =
        Math.floor(Math.random()*6)+1;

    if(d1 === d2){
        diceValues = [d1, d1, d1, d1];
        setStatus(
            currentPlayer +
            " çift attı: " +
            d1 + " - " + d2 +
            " (4 hamle hakkı)"
        );
    } else {
        diceValues = [d1, d2];
        setStatus(
            currentPlayer +
            " zar attı: " +
            d1 + " - " + d2
        );
    }
}

function setStatus(text){

    document.getElementById("status")
        .innerText=text;
}

function xyToPoint(x,y){

    const boardW = boardWidth;
    const boardH = boardHeight;
    const triW = (boardW - boardW * 0.044) / 12;

    if(y < boardH / 2){
        let col = Math.floor((boardW - x) / triW);
        if(col < 0 || col > 11) return null;
        return 12 + col;
    }else{
        let col = Math.floor(x / triW);
        if(col < 0 || col > 11) return null;
        return 11 - col;
    }
}

canvas.addEventListener("click",(e)=>{

    let rect =
        canvas.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let point = xyToPoint(x,y);

    if(point===null)
        return;

    if(selectedPoint===null){

        if(
            board[point].length>0 &&
            board[point][board[point].length-1]
            ===currentPlayer
        ){

            selectedPoint=point;

            redraw();
        }

        return;
    }

    let moveDistance =
        Math.abs(point-selectedPoint);

    if(diceValues.includes(moveDistance)){

        let piece=
            board[selectedPoint].pop();

        board[point].push(piece);

        diceValues.splice(
            diceValues.indexOf(moveDistance),
            1
        );

        selectedPoint=null;

        redraw();

        if(diceValues.length===0){

            currentPlayer =
                currentPlayer==="W"
                ? "B"
                : "W";

            setStatus(
                "Sıra: " + currentPlayer
            );
        }

    }else{

        setStatus(
            "Bu hamle için uygun zar yok."
        );
    }
});

function resetGame(){

    for(let i=0;i<24;i++)
        board[i]=[];

    initBoard();

    selectedPoint=null;
    diceValues=[];

    currentPlayer="W";

    resizeCanvas();

    setStatus("Oyun sıfırlandı");
}

initBoard();
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
