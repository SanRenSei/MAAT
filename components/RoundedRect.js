
import BaseComponent from "./BaseComponent.js";
import CoordUtil from "../util/coordUtil.js";
import evalOrGet from "../util/evalOrGet.js";

export default class RoundedRect extends BaseComponent {

  constructor({radius = 0, color = '#fff'}) {
    super();
    this.radius = radius;
    this.color = color;
  }

  draw(ctx) {
    if (!evalOrGet(this.display)) {
      return;
    }
    let {x,y,w,h} = this.transformSnapshot;
    ctx.beginPath();
    ctx.moveTo(x - w/2 + this.radius, y - h/2);
    ctx.lineTo(x + w/2 - this.radius, y - h/2);
    ctx.quadraticCurveTo(x + w/2, y - h/2, x + w/2, y - h/2 + this.radius);
    ctx.lineTo(x + w/2, y + h/2 - this.radius);
    ctx.quadraticCurveTo(x + w/2, y + h/2, x + w/2 - this.radius, y + h/2);
    ctx.lineTo(x - w/2 + this.radius, y + h/2);
    ctx.quadraticCurveTo(x - w/2, y + h/2, x - w/2, y + h/2 - this.radius);
    ctx.lineTo(x - w/2, y - h/2 + this.radius);
    ctx.quadraticCurveTo(x - w/2, y - h/2, x - w/2 + this.radius, y - h/2);
    ctx.closePath();

    ctx.stroke();
  
    ctx.fillStyle = this.color;
    ctx.fill();
    super.draw(ctx);
  }

  onClick(evtHandler) {
    this.subscribeTo('pointerdown', e => {
      if (CoordUtil.pointInRect({x:e.translatedX,y:e.translatedY}, {...this.transformSnapshot})) {
        evtHandler();
      } 
    });
    return this;
  }

}