const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const TRI_W = 60;
const CHECKER_R = 20;

let currentPlayer = "W";

let selectedPoint = null;

let diceValues = [];

const board = Array(24).fill().map(()=>[]);

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

    const boardW = canvas.width;
    const boardH = canvas.height;
    const barW = 40;
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

    const boardW = canvas.width;
    const boardH = canvas.height;
    const barW = 40;
    const triW = (boardW - barW) / 12;
    const xOffset = triW / 2;

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

        y = boardH - 40 - level*45;

    }else{

        y = 40 + level*45;
    }

    return {x,y};
}

function drawCheckers(){

    for(let p=0;p<24;p++){

        for(let i=0;i<board[p].length;i++){

            let c = board[p][i];

            let pos = pointToXY(p,i);

            ctx.beginPath();

            ctx.arc(pos.x,pos.y,CHECKER_R,0,Math.PI*2);

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

    diceValues = [d1,d2];

    setStatus(
        currentPlayer +
        " zar attı: " +
        d1 + " - " + d2
    );
}

function setStatus(text){

    document.getElementById("status")
        .innerText=text;
}

function xyToPoint(x,y){

    const boardW = canvas.width;
    const boardH = canvas.height;
    const triW = (boardW - 40) / 12;

    if(y < boardH / 2){
        // Üst sağ taraf
        let col = Math.floor((boardW - x) / triW);
        if(col < 0 || col > 11) return null;
        return 12 + col;
    }else{
        // Alt sol taraf
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

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    x *= scaleX;
    y *= scaleY;

    let point = xyToPoint(x,y);

    if(point===null)
        return;

    // taş seç
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

    // hedef seç
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

    redraw();

    setStatus("Oyun sıfırlandı");
}

initBoard();
redraw();