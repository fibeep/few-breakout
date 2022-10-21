class Game {
  constructor() {
    this.ball = new Ball(0, 0, 2, -2, ballRadius, objectColor);
    this.paddle = new Paddle(
      paddleXStart,
      paddleYStart,
      paddleWidth,
      paddleHeight
    );
    this.bricks = new Bricks(brickColumnCount, brickRowCount);
    this.scoreLabel = new GameLabel("Score ", 8, 20);
    this.livesLabel = new GameLabel("Lives ", canvas.width - 65, 20);

    // Status of keys being pressed to move paddle
    this.rightPressed = false;
    this.leftPressed = false;

    this.setup();
  }

  setup() {
    this.livesLabel.value = 3;
    this.resetBallAndPaddle();

    // Listents to whether a key or the mouse is being pressed
    // ******************** FIX THIS ******************************
    document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
    document.addEventListener(
      "mousemove",
      this.mouseMoveHandler.bind(this),
      false
    );
    // ******************** FIX THIS ******************************

    this.draw();
  }

  resetBallAndPaddle() {
    this.ball.x = canvas.width / 2;
    this.ball.y = canvas.height - 30;
    this.ball.dx = 2;
    this.ball.dy = -2;
    this.paddle.x = paddleXStart;
  }

  collisionDetection() {
    for (let c = 0; c < this.bricks.cols; c += 1) {
      for (let r = 0; r < this.bricks.rows; r += 1) {
        const brick = this.bricks.bricks[c][r];
        if (brick.status === 1) {
          if (
            this.ball.x > brick.x &&
            this.ball.x < brick.x + brickWidth &&
            this.ball.y > brick.y &&
            this.ball.y < brick.y + brickHeight
          ) {
            this.ball.dy = -this.ball.dy;
            brick.status = 0;
            this.scoreLabel.value += 1;
            if (this.scoreLabel.value === this.bricks.cols * this.bricks.rows) {
              // eslint-disable-next-line no-alert
              alert("YOU WIN, CONGRATULATIONS!");
              document.location.reload();
            }
          }
        }
      }
    }
  }

  movePaddle() {
    if (this.rightPressed && this.paddle.x < canvas.width - this.paddle.width) {
      this.paddle.moveBy(7, 0);
    } else if (this.leftPressed && this.paddle.x > 0) {
      this.paddle.moveBy(-7, 0);
    }
  }

  collisionsWithCanvasAndPaddle() {
    if (
      this.ball.x + this.ball.dx > canvas.width - this.ball.radius ||
      this.ball.x + this.ball.dx < this.ball.radius
    ) {
      this.ball.dx = -this.ball.dx;
    }
    if (this.ball.y + this.ball.dy < this.ball.radius) {
      this.ball.dy = -this.ball.dy;
    } else if (this.ball.y + this.ball.dy > canvas.height - this.ball.radius) {
      if (
        this.ball.x > this.paddle.x &&
        this.ball.x < this.paddle.x + this.paddle.width
      ) {
        // eslint-disable-next-line no-cond-assign
        if ((this.ball.y -= paddleHeight)) {
          this.ball.dy = -this.ball.dy;
        }
      } else {
        this.livesLabel.value -= 1;
        console.log(this.livesLabel.value);
        if (this.livesLabel.value < 1) {
          // eslint-disable-next-line no-alert
          alert("GAME OVER");
          document.location.reload();
        } else {
          this.resetBallAndPaddle();
        }
      }
    }
  }

  keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      this.rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      this.leftPressed = true;
    }
  }

  keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      this.rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      this.leftPressed = false;
    }
  }

  mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (this.relativeX > 0 && relativeX < canvas.width) {
      this.paddle.moveTo(relativeX - this.paddle.width / 2, paddleYStart);
    }
  }

  draw() {
    console.log("*** game.draw() ****", this);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.bricks.render(ctx);
    this.ball.render(ctx);
    this.paddle.render(ctx);
    this.collisionDetection();
    this.scoreLabel.render(ctx);
    this.livesLabel.render(ctx);
    this.ball.move();
    this.movePaddle();
    this.collisionsWithCanvasAndPaddle();

    // ******************** FIX THIS ******************************
    // Re-draws screen
    requestAnimationFrame(() => {
      this.draw();
    });
    // ******************** FIX THIS ******************************
  }
}
