
import evalOrGet from "../util/evalOrGet.js";
import BaseComponent from "./BaseComponent.js";
import Clickable from "./Clickable.js";

export default class Text extends BaseComponent {
  color: string;
  font: string;
  text: string;
  weight: any;
  relativeLineHeight: number;
  maxSize?: number;
  fontSize?: number;
  glowColor?: string;
  glowBlur?: number;
  drawFromTop?: boolean;

  constructor(text:string, {color, weight, font, relativeLineHeight, maxSize, fontSize, glowColor, glowBlur, drawFromTop}:any = {}) {
    super();
    this.color = color || '#000000';
    this.font = font || 'Arial';
    this.text = text;
    this.weight = weight || '400';
    this.relativeLineHeight = relativeLineHeight || 1.2;
    this.maxSize = maxSize || null;
    this.fontSize = fontSize || null;
    this.glowBlur = glowBlur || null;
    this.glowColor = glowColor || null;
    this.drawFromTop = drawFromTop || false;
  }

  draw(ctx:any) {
    if (!this.display || !this.text) {
      return;
    }
    let lines = evalOrGet(this.text).split('\n');
    if (lines.length<=1) {
      this.drawSingleLine(ctx);
      return;
    }

    ctx.save();
    let {x,y,w,h} = this.computeDrawInfo();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.color;

    ctx.font = `${this.weight} 24px ${this.font}`;
    let textWidths = lines.map((line: string) => ctx.measureText(line).width);
    let maxWidth = Math.max(...textWidths);

    let scaledFontSize = 24*w/maxWidth;
    if (this.maxSize && scaledFontSize > this.maxSize) {
      scaledFontSize = this.maxSize;
    }
    if (this.fontSize) {
      scaledFontSize = this.fontSize;
    }
    ctx.font = `${this.weight} ${Math.floor(scaledFontSize)}px ${this.font}`;

    if (this.glowBlur && this.glowBlur>0) {
      ctx.shadowColor = this.glowColor || this.color;
      ctx.shadowBlur = this.glowBlur;
    }

    let lineHeight = scaledFontSize * this.relativeLineHeight;
    let totalHeight = lines.length * lineHeight;
    let startingY = this.drawFromTop ? y : y - totalHeight/2 + lineHeight/2;

    for (let i=0;i<lines.length;i++) {
      ctx.fillText(lines[i], x, startingY + i*lineHeight)
    }
    ctx.restore();
  }

  drawSingleLine(ctx:any) {
    ctx.save();
    let text = evalOrGet(this.text);
    let {x,y,w,h} = this.computeDrawInfo();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.color || 'black';

    ctx.font = `${this.weight} 24px ${this.font}`;
    let textWidth = ctx.measureText(text).width;
    let scaledFontSize = 24*w/textWidth;
    if (this.maxSize && scaledFontSize > this.maxSize) {
      scaledFontSize = this.maxSize;
    }
    if (this.fontSize) {
      scaledFontSize = this.fontSize;
    }
    ctx.font = `${this.weight} ${Math.floor(scaledFontSize)}px ${this.font}`;
    if (this.glowBlur && this.glowBlur>0) {
      ctx.shadowColor = this.glowColor || this.color;
      ctx.shadowBlur = this.glowBlur;
    }
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  onClick(evtHandler:any) {
    this.addChild(new Clickable(this,evtHandler));
  }

}