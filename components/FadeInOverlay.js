
import MathUtil from "../../util/mathUtil.js";

import BaseComponent from "../BaseComponent.js";

export default class FadeInOverlay extends BaseComponent {

  constructor(parent, options) {
    let { fadeTime, onDone } = options;
    super();
    this.parent = parent;
    this.fadeTime = fadeTime;
    this.onDone = onDone;
    this.startTime = new Date().getTime();
  }

  update() {
    let progress = (new Date().getTime() - this.startTime)/this.fadeTime;
    if (progress>1) {
      this.onDone();
      this.purge();
    }
  }

  draw(ctx) {
    let alpha = (this.startTime + this.fadeTime - new Date().getTime())/this.fadeTime; // 0 when done, 1 when starting
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.fillRect(0, 0, 800, 600);
  }

}