
import MathUtil from '../../util/mathUtil.js';
import BaseComponent from './BaseComponent.js';

export default class PositionTracker extends BaseComponent {

  constructor(parent, target, {speed=0.002}) {
    super();
    this.parent = parent;
    this.target = target;
    this.speed = speed;
  }

  update() {
    let direction = MathUtil.diff2v(this.target.position, this.parent.position);
    if (direction.x==0 && direction.y==0) {
      return;
    }
    let movement = MathUtil.mult2v(MathUtil.normalize(direction), this.speed*0.01);
    if (MathUtil.get2vMagSq(movement) > MathUtil.get2vMagSq(direction)) {
      this.parent.position = {...this.target.position};
    } else {
      this.parent.position = MathUtil.add2v(this.parent.position, movement);
    }
  }

}