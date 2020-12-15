/*jslint es6:true*/

const rulesBtn  = document.getElementById('rules-btn');
const closeBtn  = document.getElementById('close-btn');
const rules  = document.getElementById('rules');
const canvas  = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score  = 0;

const brickRowCount = 9;
const brickColCount  = 5;


//create ball props

const ball =  {
    x: canvas.width/ 2,
    y: canvas.height/2,
    size:10,
    speed:4,
    dx:4,
    dy: -4
};

//create paddle props

const paddle = {
   x:canvas.width / 2 - 40,
   y: canvas.height - 20,
   w: 80,
   h:10,
   speed: 8 , 
   dx: 0

};



// Create Brick props

const brickInfo  = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offSetY: 60,
    visible:true
};



// create Bricks

const bricks = [];

for(let i = 0; i < brickRowCount; i++)
{
    bricks[i] = [];
    for(let j = 0; j < brickColCount; j++)
    {
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offSetY;
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        
        bricks[i][j] = { x, y, ...brickInfo };
    }
}

// console.log(bricks);


//  Draw ball on canvas

function drawBall()
{
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle  = '#0095dd';
    ctx.fill();
    ctx.closePath();
}


// draw paddle on canvas 
function drawPaddle()
{
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle  = '#0095dd';
    ctx.fill();
    ctx.closePath();
}



// draw score on canvas

function drawScore(){
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`,canvas.width - 100, 30);
}


// Draw bricks on canvas

function drawBricks() {
    bricks.forEach((column) => {
        column.forEach( (brick) => {
            ctx.beginPath();

            ctx.rect(brick.x, brick.y , brick.w, brick.h);
            ctx.fillStyle  =  brick.visible? '#0095dd' : 'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })
}



// Move paddle canvas
function movePaddle(){
    paddle.x += paddle.dx;

    // wall detection
    if(paddle.x + paddle.w > canvas.width){
        paddle.x = canvas.width - paddle.w;
    }

    if(paddle.x < 0){
        paddle.x = 0;
    }
}



// Move Ball
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // wall collision(right/left)
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0 ) {
        ball.dx *= -1; // ball.dx = ball.dx * -1
    }
    // Wall collision (top/bottom)
    if(ball.y + ball.size>canvas.height || ball.y - ball.size < 0 ){
        ball.dy *= -1; 
    }
    // console.log(ball.x,ball.y);

    // Paddle collision
    if(ball.x + ball.size > paddle.x && 
        ball.x + ball.size < paddle.x + paddle.w && 
        ball.y + ball.size > paddle.y) {
            ball.dy =- ball.speed;
        }

        // brick collision
        bricks.forEach(column=>{
            column.forEach(brick=>{
                if(brick.visible){
                    if(ball.x - ball.size > brick.x && //left brick side check
                        ball.x +ball.size < brick.x + brick.w && // right brick side check
                        ball.y + ball.size > brick.y &&  //top brick side check
                        ball.y-ball.size < brick.y + brick.h //bottom brick side check
                    ){
                        ball.dy *= -1;
                        brick.visible = false;


                        increaseScore();
                    }
                }
            })
        })

        if(ball.y + ball.size >canvas.height){
            showAllBreaks();
            score = 0;
        }

}


// increase score
function increaseScore()
{
    score++;
    if(score & (brickRowCount*brickColCount) ===0){
        showAllBreaks();
    }

}


// show all bricks
function showAllBreaks(){
    bricks.forEach(column=>{
        column.forEach(brick=>brick.visible = true)
    })
}


//  draw everything

function draw(){
    // clear canvas
    ctx.clearRect(0 ,0 ,canvas.width,canvas.height)
    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
}
  

// update function using requestAnimationFrame for drawing on canvas and animation

function update(){

    movePaddle();
    moveBall();
    // Draw everything
      draw();

      requestAnimationFrame(update)
}

update();


// Keydown event

function keyDown(e){
    if(e.key === 'Right' || e.key === 'ArrowRight'){
        paddle.dx = paddle.speed;
    }else if(e.key === 'Left' || e.key ==='ArrowLeft') {
         paddle.dx =  - paddle.speed;
    }
}

//  KeyUp event
function keyUp(e){
    if(e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft'){
        paddle.dx = 0;
    }
}



// Keyboards eventListener

document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);



// rules and close event handlers

rulesBtn.addEventListener('click',()=>{
    rules.classList.add('show');
})

closeBtn.addEventListener('click',()=>{
    rules.classList.remove('show');
})