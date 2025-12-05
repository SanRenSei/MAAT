import BaseComponent from "./BaseComponent.js";

export default class PositionTween extends BaseComponent {

  constructor(parent, targetPosition, time, onComplete = () => {}) {
    super();
    this.parent = parent;
    this.startPosition = this.parent.computeRelativePosition();
    this.targetPosition = targetPosition;
    this.startTime = new Date().getTime();
    this.pathTime = time;
    this.onComplete = onComplete;
  }

  update() {
    let pathCompletion = (new Date().getTime() - this.startTime)/this.pathTime;
    if (pathCompletion>1) {
      pathCompletion=1;
    }
    let tweenPosition = {x: this.startPosition.x*(1-pathCompletion) + this.targetPosition.x*pathCompletion, 
      y: this.startPosition.y*(1-pathCompletion) + this.targetPosition.y*pathCompletion};
    this.parent.withPosition(tweenPosition);
    if (pathCompletion>=1) {
      this.onComplete();
      this.purge();
    }
  }

}