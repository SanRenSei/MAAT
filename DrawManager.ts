import BaseComponent from './components/BaseComponent.ts';
import collider from './event/Collider.ts';
import RootComponent from './root/index.js';

class DrawManager {
  root: RootComponent|null;
  drawingQueue: BaseComponent[];
  ctx: any;
  width: number;
  height: number;

  constructor() {
    this.root = null;
    this.drawingQueue = [];
  }

  hoistCanvas(canvas, width, height) {
    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.root = new RootComponent();
  }

  draw(ctx) {
    if (!this.root) {
      return;
    }
    ctx.clearRect(0,0,this.width,this.height);
    this.root.takeTransformSnapshot();
    this.root.draw(ctx);
    this.drawQueue(ctx);
    this.root.update();
    collider.checkCollisions();
  }

  begin() {
    setInterval(() => this.draw(this.ctx), 10);
  }

  addToDrawQueue(component) {
    this.drawingQueue.push(component);
  }

  drawQueue(ctx) {
    this.drawingQueue.sort((a, b) => {
      const aPriority = Array.isArray(a.drawPriority) ? a.drawPriority : [a.drawPriority];
      const bPriority = Array.isArray(b.drawPriority) ? b.drawPriority : [b.drawPriority];
    
      const len = Math.min(aPriority.length, bPriority.length);
      for (let i = 0; i < len; i++) {
        if (aPriority[i] !== bPriority[i]) {
          return aPriority[i] - bPriority[i];
        }
      }
      return aPriority.length - bPriority.length;
    });

    for (let toDraw of this.drawingQueue) {
      toDraw.draw(ctx, true);
    }

    this.drawingQueue = [];
  }

}

let drawManager = new DrawManager();
export default drawManager;