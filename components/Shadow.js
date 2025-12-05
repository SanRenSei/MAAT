
import MathUtil from "../../util/mathUtil.js";

import BaseComponent from "../BaseComponent.js";

export default class Shadow extends BaseComponent {

  constructor(parent) {
    super();
    this.parent = parent;
    this.spriteBehavior = 'shadow';
    this.positionBehavior = this.parent.computePosition();
    this.sizeBehavior = this.parent.computeSize();
    this.height = 0;
  }

  update() {
    this.positionBehavior = MathUtil.add2v(this.parent.computePosition(), {x:0, y:this.height});
    this.sizeBehavior = MathUtil.mult2v(this.parent.computeSize(), 0.5);
  }

}