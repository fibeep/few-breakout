/* eslint-disable quotes */

import Ball from './Ball';
import Bricks from './Bricks';
import GameLabel from './GameLabel';
import Sprite from './Sprite';

class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    this.ballRadius = 10;
    this.objectColor = 'green';
    this.paddleHeight = 10;
    this.paddleWidth = 75;
    this.paddleXStart = (this.canvas.width - this.paddleWidth) / 2;
    this.paddleYStart = this.canvas.height - this.paddleHeight;
    // Brick rows x columns
    this.brickRowCount = 4;
    this.brickColumnCount = 5;

    // Brick parameters
    this.brickWidth = 75;
    this.brickHeight = 20;
    this.brickPadding = 10;
    this.brickOffsetTop = 30;
    this.brickOffsetLeft = 30;

    this.ball = new Ball(0, 0, 2, -2, this.ballRadius, this.objectColor);
    this.paddle = new Sprite(
      this.paddleXStart,
      this.paddleYStart,
      this.paddleWidth,
      this.paddleHeight,
    );

    this.bricks = new Bricks({
      cols: this.brickColumnCount,
      rows: this.brickRowCount,
      width: this.brickWidth,
      height: this.brickHeight,
      padding: this.brickPadding,
      brickOffsetTop: this.brickOffsetTop,
      brickOffsetLeft: this.brickOffsetLeft,
      color: this.objectColor,
    });

    this.scoreLabel = new GameLabel('Score ', 8, 20, this.objectColor);
    this.livesLabel = new GameLabel('Lives ', this.canvas.width - 65, 20, 'orange');

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
    document.addEventListener('keydown', this.keyDownHandler.bind(this), false);
    document.addEventListener('keyup', this.keyUpHandler.bind(this), false);
    document.addEventListener(
      'mousemove',
      this.mouseMoveHandler.bind(this),
      false,
    );
    // ******************** FIX THIS ******************************

    this.draw();
  }

  resetBallAndPaddle() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height - 30;
    this.ball.dx = 2;
    this.ball.dy = -2;
    this.paddle.x = this.paddleXStart;
  }

  collisionDetection() {
    for (let c = 0; c < this.bricks.cols; c += 1) {
      for (let r = 0; r < this.bricks.rows; r += 1) {
        const brick = this.bricks.bricks[c][r];
        if (brick.status === 1) {
          if (
            this.ball.x > brick.x
            && this.ball.x < brick.x + this.brickWidth
            && this.ball.y > brick.y
            && this.ball.y < brick.y + this.brickHeight
          ) {
            this.ball.dy = -this.ball.dy;
            brick.status = 0;
            this.scoreLabel.value += 1;
            if (this.scoreLabel.value === this.bricks.cols * this.bricks.rows) {
              // eslint-disable-next-line no-alert
              alert('YOU WIN, CONGRATULATIONS!');
              document.location.reload();
            }
          }
        }
      }
    }
  }

  movePaddle() {
    if (
      this.rightPressed
      && this.paddle.x < this.canvas.width - this.paddle.width
    ) {
      this.paddle.moveBy(7, 0);
    } else if (this.leftPressed && this.paddle.x > 0) {
      this.paddle.moveBy(-7, 0);
    }
  }

  collisionsWithCanvasAndPaddle() {
    if (
      this.ball.x + this.ball.dx > this.canvas.width - this.ball.radius
      || this.ball.x + this.ball.dx < this.ball.radius
    ) {
      this.ball.dx = -this.ball.dx;
    }
    if (this.ball.y + this.ball.dy < this.ball.radius) {
      this.ball.dy = -this.ball.dy;
    } else if (
      this.ball.y + this.ball.dy
      > this.canvas.height - this.ball.radius
    ) {
      if (
        this.ball.x > this.paddle.x
        && this.ball.x < this.paddle.x + this.paddle.width
      ) {
        // eslint-disable-next-line no-cond-assign
        if ((this.ball.y -= this.paddleHeight)) {
          this.ball.dy = -this.ball.dy;
        }
      } else {
        this.livesLabel.value -= 1;
        // console.log(this.livesLabel.value);
        if (this.livesLabel.value === 0) {
          // eslint-disable-next-line no-alert
          alert('GAME OVER');
          document.location.reload();
        } else {
          this.resetBallAndPaddle();
        }
      }
    }
  }

  keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = true;
    }
  }

  keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = false;
    }
  }

  mouseMoveHandler(e) {
    const relativeX = e.clientX - this.canvas.offsetLeft;
    if (this.relativeX > 0 && relativeX < this.canvas.width) {
      this.paddle.moveTo(relativeX - this.paddle.width / 2, this.spaddleYStart);
    }
  }

  draw() {
    // console.log('*** game.draw() ****', this);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.bricks.render(this.ctx);
    this.ball.render(this.ctx);
    this.paddle.render(this.ctx);
    this.collisionDetection();
    this.scoreLabel.render(this.ctx);
    this.livesLabel.render(this.ctx);
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

export default Game;
