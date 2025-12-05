
import MathUtil from "../../util/mathUtil.js";

import BaseComponent from "../BaseComponent.js";

export default class FadeOutOverlay extends BaseComponent {

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
    }
  }

  draw(ctx) {
    let alpha = (new Date().getTime() - this.startTime)/this.fadeTime; // 1 when done, 0 when starting
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.fillRect(0, 0, 800, 600);
  }

}