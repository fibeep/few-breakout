const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
// ------------------------
// Constants
//------------------------
const ballRadius = 10;
const PI2 = Math.PI * 2;
const objectColor = '#0095DD';
const paddleHeight = 10;
const paddleWidth = 75;
const paddleXStart = (canvas.width - paddleWidth) / 2;
// Brick rows x columns
const brickRowCount = 4;
const brickColumnCount = 5;

// Brick parameters
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

//-----------------------
// Variables
//-----------------------

// Defines ball parameters
let x;
let y;
let dx;
let dy;

let ball = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
}

let paddleX;

resetBallAndPaddle();

// Status of keys being pressed to move paddle
let rightPressed = false;
let leftPressed = false;
// Lives and Initial Score
let lives = 3;
let score = 0;

// Brick layout + setup
const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Moves mouse
function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// Indicates for key being pressed
function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

// Indicates for key NOT being pressed
function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

// Listents to whether a key or the mouse is being pressed
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

// Detects collision between ball and bricks / paddle
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (
          ball.x > brick.x && 
          ball.x < brick.x + brickWidth && 
          ball.y > brick.y && ball.y < brick.y + brickHeight
        ) {
          ball.dy = -ball.dy;
          brick.status = 0;
          score += 1;
          if (score === brickRowCount * brickColumnCount) {
            // eslint-disable-next-line no-alert
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
          }
        }
      }
    }
  }
}

// Draws the score on canvas
function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = objectColor;
  ctx.fillText(`Score: ${score}`, 8, 20);
}

// Draws the lives on canvas
function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = objectColor;
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

// Draws the ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, PI2);
  ctx.fillStyle = objectColor;
  ctx.fill();
  ctx.closePath();
}

// Draws the paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = objectColor;
  ctx.fill();
  ctx.closePath();
}

// Draws the bricks on canvas
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = objectColor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function resetBallAndPaddle() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 30;
  ball.dx = 2;
  ball.dy = -2;
  paddleX = paddleXStart;
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}
// Draws the canvas and the entire game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawScore();
  drawLives();
  moveBall();

  if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ballRadius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ballRadius) {
    if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
      // eslint-disable-next-line no-cond-assign
      if ((ball.y -= paddleHeight)) {
        ball.dy = -ball.dy;
      }
    } else {
      lives -= 1;
      if (!lives) {
        // eslint-disable-next-line no-alert
        alert('GAME OVER');
        document.location.reload();
      } else {
        resetBallAndPaddle();
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  requestAnimationFrame(draw);
}

draw();
