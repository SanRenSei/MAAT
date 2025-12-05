
import MathUtil from '../../util/mathUtil.js';
import BaseComponent from './BaseComponent.js';

export default class Spin extends BaseComponent {

  constructor(parent, speed) {
    super();
    this.parent = parent;
    this.speed = speed;
  }

  update() {
    this.parent.rotation += this.speed*0.01;
  }

}