
import BaseComponent from "./BaseComponent.js";

export default class AnimatedSprite extends BaseComponent {

  constructor(parent, sprites, numFrames, params) {
    super();
    this.parent = parent;
    if (typeof sprites == 'string') {
      this.baseSpriteName = sprites;
    } else {
      this.sprites = sprites;
    }
    this.numFrames = numFrames;
    this.loopTime = params?.loopTime || 1000;
    this.startTime = new Date().getTime();
    this.withSize(parent.computeSize());
  }

  update() {
    let frameNum = Math.floor((new Date().getTime()-this.startTime)%this.loopTime/(this.loopTime/this.numFrames));
    if (this.baseSpriteName) {
      this.parent.sprite = this.baseSpriteName + (frameNum+1);
    } else {
      this.parent.sprite = this.sprites[frameNum];
    }
  }

}