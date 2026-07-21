import BaseComponent from "./BaseComponent.js";

export default class SizeTween extends BaseComponent {
  startSize: {w:number,h:number};
  targetSize: {w:number,h:number};
  startTime: number;
  pathTime: number;
  onComplete: any;

  constructor(parent:BaseComponent, targetSize:{w:number,h:number}, time:number, onComplete:any = () => {}) {
    super();
    this.parent = parent;
    this.startSize = this.parent.computeSize();
    this.targetSize = targetSize;
    this.startTime = new Date().getTime();
    this.pathTime = time;
    this.onComplete = onComplete;
  }

  update() {
    let pathCompletion = (new Date().getTime() - this.startTime)/this.pathTime;
    if (pathCompletion>1) {
      pathCompletion=1;
    }
    let tweenSize = {w: this.startSize.w*(1-pathCompletion) + this.targetSize.w*pathCompletion, 
      h: this.startSize.h*(1-pathCompletion) + this.targetSize.h*pathCompletion};
    this.parent?.withSize(tweenSize);
    if (pathCompletion>=1) {
      this.onComplete();
      this.purge();
    }
  }

}