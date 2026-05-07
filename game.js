const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const TRI_W = 60;
const TRI_H = 220;

let currentPlayer = "W";

function drawBoard(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // zemin
    ctx.fillStyle = "#d9b97a";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // orta bar
    ctx.fillStyle = "#8b6b3f";
    ctx.fillRect(430,0,40,600);

    // üst üçgenler
    for(let i=0;i<12;i++){

        ctx.beginPath();

        let x = i*60;

        ctx.moveTo(x,0);
        ctx.lineTo(x+60,0);
        ctx.lineTo(x+30,220);

        ctx.fillStyle =
            i%2===0 ? "#a55f22" : "#6d4c41";

        ctx.fill();
    }

    // alt üçgenler
    for(let i=0;i<12;i++){

        ctx.beginPath();

        let x = i*60;

        ctx.moveTo(x,600);
        ctx.lineTo(x+60,600);
        ctx.lineTo(x+30,380);

        ctx.fillStyle =
            i%2===0 ? "#6d4c41" : "#a55f22";

        ctx.fill();
    }
}

function drawChecker(x,y,color){

    ctx.beginPath();

    ctx.arc(x,y,20,0,Math.PI*2);

    ctx.fillStyle =
        color==="W" ? "white" : "black";

    ctx.fill();

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function placeStartCheckers(){

    drawChecker(30,30,"W");
    drawChecker(30,75,"W");

    drawChecker(690,570,"B");
    drawChecker(690,525,"B");
}

function rollDice(){

    let d1 = Math.floor(Math.random()*6)+1;
    let d2 = Math.floor(Math.random()*6)+1;

    document.getElementById("status").innerText =
        currentPlayer +
        " zar attı: " +
        d1 + " - " + d2;
}

function resetGame(){

    drawBoard();
    placeStartCheckers();

    document.getElementById("status").innerText =
        "Oyun sıfırlandı";
}

drawBoard();
placeStartCheckers();
