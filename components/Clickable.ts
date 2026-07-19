
import CoordUtil from "../util/coordUtil.ts";
import BaseComponent from "./BaseComponent.ts";

export default class Clickable extends BaseComponent {
  clickHandler: any;

  constructor(parent:BaseComponent, clickHandler:any) {
    super();
    this.parent = parent;
    this.clickHandler = clickHandler;
    this.subscribeTo('pointerdown', (e:any) => {
      if (CoordUtil.pointInRect({x:e.translatedX,y:e.translatedY}, {...this.parent?.transformSnapshot})) {
        this.clickHandler();
      } 
    });
  }

}