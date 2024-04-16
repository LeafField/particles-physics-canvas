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

  constructor(private effect: Effect, public x: number, public y: number) {
    this.width = this.effect.cellWidth;
    this.height = this.effect.cellHeight;
    this.image = document.querySelector<HTMLImageElement>("#projectImage")!;
    this.slideX = 0;
    this.slideY = 0;
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(
      this.image,
      this.x,
      this.y,
      this.width,
      this.height,
      this.x + this.slideX,
      this.y + this.slideY,
      this.width,
      this.height
    );
    context.strokeRect(this.x, this.y, this.width, this.height);
  }

  update() {}
}

class Effect {
  width: number;
  height: number;
  cellWidth: number;
  cellHeight: number;
  cell: Cell;
  imageGrid: Cell[];

  constructor(public canvas: HTMLCanvasElement) {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.cellWidth = this.width / 35;
    this.cellHeight = this.height / 55;
    this.cell = new Cell(this, 0, 0);
    this.imageGrid = [];
    this.createGrid();
  }

  createGrid() {
    for (let y = 0; y < this.height; y += this.cellHeight) {
      for (let x = 0; x < this.width; x += this.cellWidth) {
        this.imageGrid.push(new Cell(this, x, y));
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
  effect.render(ctx);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
