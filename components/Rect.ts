
import BaseComponent from "./BaseComponent.ts";
import Clickable from "./Clickable.ts";

export default class Rect extends BaseComponent {
  fillColor: string|null;

  constructor(params:{fillColor?:string}={}) {
    super();
    this.fillColor = null;
    if (params.fillColor) {
      this.fillColor = params.fillColor;
    }
  }

  draw(ctx) {
    if (!this.display) {
      return;
    }
    let {x,y,w,h} = this.transformSnapshot;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.globalAlpha = this.alpha;
    ctx.strokeRect(x - w/2, y - h/2, w, h);
    if (this.fillColor) {
      ctx.fillStyle = this.fillColor;
      ctx.fillRect(x - w/2, y - h/2, w, h);
    }
    ctx.globalAlpha = 1;
    super.draw(ctx);
  }

  onClick(evtHandler) {
    this.addChild(new Clickable(this,evtHandler));
  }

}