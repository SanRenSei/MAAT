
import BaseComponent from "../BaseComponent.js";

export default class DamageFlicker extends BaseComponent {

  constructor(parent) {
    super();
    this.parent = parent;
    this.damageStart = new Date().getTime();
  }

  update() {
    let parentSprite = this.parent.computeSprite();
    let timeElapsed = new Date().getTime() - this.damageStart;
    if (timeElapsed % 250 > 125) {
      if (parentSprite.indexOf('_damaged')==-1) {
        this.parent.withSprite(parentSprite + '_damaged');
      }
    } else {
      if (parentSprite.indexOf('_damaged')>=0) {
        this.parent.withSprite(parentSprite.split('_damaged')[0]);
      }
    }
    if (timeElapsed >= 2000) {
      if (parentSprite.indexOf('_damaged')>=0) {
        this.parent.withSprite(parentSprite.split('_damaged')[0]);
      }
      this.parent.removeChild(this);
    }
  }

}