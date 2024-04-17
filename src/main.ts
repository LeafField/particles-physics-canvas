import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas1")!;
const ctx = canvas.getContext("2d")!;

canvas.width = 500;
canvas.height = 700;

class Cell {
  width: number;
  height: number;
  image: HTMLImageElement;
  slideX: number;
  slideY: number;
  vx: number;
  vy: number;
  ease: number;
  friction: number;
  positionX: number;
  positionY: number;
  speedX: number;
  speedY: number;
  randamize: number;

  constructor(
    private effect: Effect,
    public x: number,
    public y: number,
    private order: number
  ) {
    this.width = this.effect.cellWidth;
    this.height = this.effect.cellHeight;
    this.image = document.querySelector<HTMLImageElement>("#projectImage")!;
    this.slideX = 0;
    this.slideY = 0;
    this.vx = 0;
    this.vy = 0;
    this.ease = 0.01;
    this.friction = 0.9;
    this.positionX = this.effect.width / 2;
    this.positionY = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.randamize = Math.random() * 20 + 2;
    setTimeout(() => {
      this.start();
    }, this.order * 10);
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(
      this.image,
      this.x + this.slideX,
      this.y + this.slideY,
      this.width,
      this.height,
      this.positionX,
      this.positionY,
      this.width,
      this.height
    );
    context.strokeRect(this.positionX, this.positionY, this.width, this.height);
  }

  start() {
    this.speedX = (this.x - this.positionX) / this.randamize;
    this.speedY = (this.y - this.positionY) / this.randamize;
  }

  update() {
    if (Math.abs(this.speedX) > 0.01 || Math.abs(this.speedY) > 0.01) {
      this.speedX = (this.x - this.positionX) / this.randamize;
      this.speedY = (this.y - this.positionY) / this.randamize;
      this.positionX += this.speedX;
      this.positionY += this.speedY;
    }

    if (this.effect.mouse.x && this.effect.mouse.y) {
      const dx = this.effect.mouse.x - this.x;
      const dy = this.effect.mouse.y - this.y;
      const distance = Math.hypot(dx, dy);
      if (distance < this.effect.mouse.radius) {
        const angle = Math.atan2(dy, dx);
        const force = distance / this.effect.mouse.radius;
        this.vx = force * Math.cos(angle);
        this.vy = force * Math.sin(angle);
      }
    } else {
      this.vx = 0;
      this.vy = 0;
    }
    this.slideX += (this.vx *= this.friction) - this.slideX * this.ease;
    this.slideY += (this.vy *= this.friction) - this.slideY * this.ease;
  }
}

type Mouse = {
  x: number | undefined;
  y: number | undefined;
  radius: number;
};

class Effect {
  width: number;
  height: number;
  cellWidth: number;
  cellHeight: number;
  imageGrid: Cell[];
  mouse: Mouse;

  constructor(public canvas: HTMLCanvasElement) {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.cellWidth = this.width / 20;
    this.cellHeight = this.height / 30;
    this.imageGrid = [];
    this.createGrid();
    this.mouse = {
      x: undefined,
      y: undefined,
      radius: 100,
    };
    this.canvas.addEventListener("mousemove", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
    });
    this.canvas.addEventListener("mouseleave", () => {
      this.mouse.x = undefined;
      this.mouse.y = undefined;
    });
  }

  createGrid() {
    let index = 0;
    for (let y = 0; y < this.height; y += this.cellHeight) {
      for (let x = 0; x < this.width; x += this.cellWidth) {
        this.imageGrid.push(new Cell(this, x, y, index));
        index++;
      }
    }
  }

  render(context: CanvasRenderingContext2D) {
    this.imageGrid.forEach((cell) => {
      cell.update();
      cell.draw(context);
    });
  }
}

const effect = new Effect(canvas);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.render(ctx);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
