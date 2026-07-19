
import MathUtil from '../util/mathUtil.js';
import BaseComponent from './BaseComponent.js';

export default class DirectionalMove extends BaseComponent {
  parent: BaseComponent;
  direction:{x:number,y:number};
  speed:number;

  constructor(parent:BaseComponent, direction:{x:number,y:number}, speed:number) {
    super();
    this.parent = parent;
    this.direction = MathUtil.normalize(direction);
    this.speed = speed;
  }

  update() {
    this.parent.position = MathUtil.add2v(this.parent.position, MathUtil.mult2v(this.direction, this.speed*0.01));
  }

}