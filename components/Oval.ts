import CoordUtil from "../util/coordUtil.js";
import BaseComponent from "./BaseComponent.js";

export default class Oval extends BaseComponent {
  fillColor: string|null;

  constructor(params:{fillColor?:string}={}) {
    super();
    this.fillColor = null;
    if (params.fillColor) {
      this.fillColor = params.fillColor;
    }
  }

  draw(ctx:any) {
    let {x,y,w,h} = this.transformSnapshot;
    ctx.beginPath();
    ctx.ellipse(x, y, w/2, h/2, 0, 0, 2*Math.PI);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
    if (this.fillColor) {
      ctx.fillStyle = this.fillColor;
      ctx.fill();
    }
    super.draw(ctx);
  }

  onClick(evtHandler:any) {
    this.subscribeTo('pointerdown', e => {
      if (CoordUtil.pointInOval({x:e.translatedX,y:e.translatedY}, {...this.transformSnapshot})) {
        evtHandler();
      } 
    });
    return this;
  }

}