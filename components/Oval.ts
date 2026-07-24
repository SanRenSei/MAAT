import CoordUtil from "../util/coordUtil.js";
import BaseComponent from "./BaseComponent.js";

export default class Oval extends BaseComponent {
  fillColor: string|null;
  color: string|null;
  arc: number[];

  constructor(params:{fillColor?:string,color?:string,arc?:number[]}={}) {
    super();
    this.fillColor = null;
    this.color = params.color || null;
    this.arc = [0, 2*Math.PI];
    if (params.fillColor) {
      this.fillColor = params.fillColor;
    }
    if (params.arc) {
      this.arc = params.arc;
    }
  }

  draw(ctx:any) {
    if (this.arc[0]==0 && this.arc[1]==2*Math.PI) {
      this.drawFull(ctx);
      return;
    }
    let {x,y,w,h} = this.transformSnapshot;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.ellipse(x, y, w/2, h/2, 0, this.arc[0], this.arc[1]);
    ctx.closePath();
    ctx.strokeStyle = this.color || 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
    if (this.fillColor) {
      ctx.fillStyle = this.fillColor;
      ctx.fill();
    }
    super.draw(ctx);
  }

  drawFull(ctx:any) {
    let {x,y,w,h} = this.transformSnapshot;

    ctx.beginPath();
    ctx.ellipse(x, y, w/2, h/2, 0, 0, 2*Math.PI);

    if (this.fillColor) {
      ctx.fillStyle = this.fillColor;
      ctx.fill();
    }

    if (this.color) {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    super.draw(ctx);
  }

  onClick(evtHandler:any) {
    this.subscribeTo('pointerdown', (e:any) => {
      if (CoordUtil.pointInOval({x:e.translatedX,y:e.translatedY}, {...this.transformSnapshot})) {
        evtHandler();
      } 
    });
    return this;
  }

}