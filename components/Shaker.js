
import BaseComponent from './BaseComponent.js';

export default class Shaker extends BaseComponent {

  constructor(parent, {shakeAmount = 1}) {
    super();
    this.parent = parent;
    this.originalPosition = parent.transformSnapshot;
    this.shakeAmount = shakeAmount;
  }

  update() {
    this.parent.withPosition({x:this.originalPosition.x + this.shakeAmount*(Math.random()-0.5), y:this.originalPosition.y + this.shakeAmount*(Math.random()-0.5)});
  }

  purge() {
    this.parent.withPosition({x:this.originalPosition.x, y:this.originalPosition.y});
    super.purge();
  }

}