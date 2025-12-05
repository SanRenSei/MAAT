
import MathUtil from '../../util/mathUtil.js';
import BaseComponent from './BaseComponent.js';

export default class TargetMove extends BaseComponent {

  constructor(parent, targetPosition, velocity, onComplete = () => {}) {
    super();
    this.parent = parent;
    this.startPosition = this.parent.computeRelativePosition();
    this.targetPosition = targetPosition;
    this.startTime = new Date().getTime();
    this.velocity = velocity;
    this.onComplete = onComplete;
  }

  update() {
    let direction = MathUtil.diff2v(this.targetPosition, this.parent.position);
    if (direction.x==0 && direction.y==0) {
      return;
    }
    let movement = MathUtil.mult2v(MathUtil.normalize(direction), this.velocity*0.01);
    if (MathUtil.get2vMagSq(movement) > MathUtil.get2vMagSq(direction)) {
      this.parent.position = {...this.targetPosition};
      this.onComplete();
      this.purge();
    } else {
      this.parent.position = MathUtil.add2v(this.parent.position, movement);
    }
  }

}