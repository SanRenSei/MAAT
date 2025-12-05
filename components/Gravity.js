
import BaseComponent from './BaseComponent.js';

export default class Gravity extends BaseComponent {

  constructor(parent, {strength}) {
    super();
    this.parent = parent;
    this.strength = strength;
    if (!this.parent.dy) {
      this.parent.dy = 0;
    }
  }

  update() {
    let timestep = 0.05;
    this.parent.dy -= this.strength*timestep;
    this.parent.position.y += this.parent.dy*timestep;
  }

}