class Bricks {
  constructor(options) {
    this.cols = options.cols;
    this.rows = options.rows;
    this.bricks = [];
    this.width = options.width;
    this.height = options.height;
    this.padding = options.padding;
    this.brickOffsetTop = options.brickOffsetTop;
    this.brickOffsetLeft = options.brickOffsetLeft;
    this.color = options.color;
    this.init();
  }

  init() {
    for (let c = 0; c < this.cols; c += 1) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rows; r += 1) {
        const brickX = c * (this.width + this.padding) + this.brickOffsetLeft;
        const brickY = r * (this.height + this.padding) + this.brickOffsetTop;
        this.bricks[c][r] = new Brick(
          brickX,
          brickY,
          this.width,
          this.height,
          this.color,
        );
      }
    }
  }

  render(ctx) {
    for (let c = 0; c < this.cols; c += 1) {
      for (let r = 0; r < this.rows; r += 1) {
        const brick = this.bricks[c][r];
        if (this.bricks.status === 1) {
          brick.render(ctx);
        }
      }
    }
  }
}
