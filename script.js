const canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

let speed = 10;
let x=canvas.width/2;
let y= canvas.height-30;
let dx=2;
let dy=-2;
let ballRadius=10;

let paddleWidth = 75;
let paddleHeight = 10;
let paddleX = (canvas.width-paddleWidth)/2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for( var c=0; c<brickColumnCount; c++){
    bricks[c] = [];
    for (r=0; r<brickRowCount; r++){
        bricks[c][r]={x:0, y:0, status:1};
    }
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
           var b = bricks[c][r];
           if (b.status===1){
            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
           }
         }
    }
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                }
            }
        }
    }
}

function pickShade(){
   return (0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
    
}

let randomColour = pickShade();

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius,0, Math.PI*2);
    ctx.fillStyle='#'+ randomColour;
    ctx.fill();
    ctx.closePath();
    
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    if(rightPressed) {
        paddleX += 3;
        if(paddleX+paddleWidth>canvas.width){
            paddleX = canvas.width-paddleWidth;
        }
    }
    else if(leftPressed) {
        paddleX -= 3;
        if(paddleX<0){
            paddleX=0;
        }
    }
    collisionDetection();
    drawBricks();
    drawPaddle();
    drawBall();

    x = x+dx;
    y = y+dy;
    if (x+dx > canvas.width-ballRadius || x+dx < ballRadius) {
        dx= -dx;
        randomColour = pickShade();
    }
    if (y+dy < ballRadius || y+dy > canvas.height-ballRadius) {
        if(y+dy < ballRadius){
            dy = -dy; 
        }
        else if(y+dy > canvas.height-ballRadius){
            if(x > paddleX && x < paddleX + paddleWidth ){
                dy = -dy;
            }
            else{
                alert('GAME OVER');
            document.location.reload();
            clearInterval(interval);
            }
        }
    }
}

document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);

function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}
let interval = setInterval(draw,10);

