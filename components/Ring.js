
import CoordUtil from "../../util/coordUtil.js";
import BaseComponent from "./BaseComponent.js";

export default class Ring extends BaseComponent {

  constructor({thickness, color}) {
    super();
    this.thickness = thickness;
    this.color = color;
  }

  draw(ctx) {
    let {x,y,w,h} = this.transformSnapshot;
    ctx.beginPath();
    ctx.arc(x, y, w/2, 0, Math.PI * 2, false);
    ctx.arc(x, y, w/2-this.thickness, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    super.draw(ctx);
  }

  onClick(evtHandler) {
    this.subscribeTo('pointerdown', e => {
      if (CoordUtil.pointInOval({x:e.translatedX,y:e.translatedY}, {...this.transformSnapshot})) {
        evtHandler();
      } 
    });
    return this;
  }

  onHover(evtHandler) {
    this.subscribeTo('pointermove', e => {
      if (CoordUtil.pointInOval({x:e.translatedX,y:e.translatedY}, {...this.transformSnapshot})) {
        evtHandler();
      } 
    });
    return this;
  }

  onUnhover(evtHandler) {
    this.subscribeTo('pointermove', e => {
      if (!CoordUtil.pointInOval({x:e.translatedX,y:e.translatedY}, {...this.transformSnapshot})) {
        evtHandler();
      } 
    });
    return this;
  }

}