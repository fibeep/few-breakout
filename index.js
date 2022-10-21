/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
// ------------------------
// Constants
//------------------------
const ballRadius = 10;
const PI2 = Math.PI * 2;
const objectColor = 'orange';
const paddleHeight = 10;
const paddleWidth = 75;
const paddleXStart = (canvas.width - paddleWidth) / 2;
const paddleYStart = canvas.height - paddleHeight;
// Brick rows x columns
const brickRowCount = 4;
const brickColumnCount = 5;

// Brick parameters
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const game = new Game();
