
import CoordUtil from "../util/coordUtil.ts";
import BaseComponent from "./BaseComponent.ts";

export default class Hoverable extends BaseComponent {
  hoverHandler: any;
  unhoverHandler: any;
  isHovered: boolean;

  constructor(parent, onHover, onUnhover) {
    super();
    this.parent = parent;
    this.hoverHandler = onHover;
    this.unhoverHandler = onUnhover;
    this.isHovered = false;
    this.subscribeTo('pointermove', e => {
      if (CoordUtil.pointInRect({x:e.translatedX,y:e.translatedY}, {...this.parent?.transformSnapshot})) {
        if (!this.isHovered) {
          this.isHovered = true;
          this.hoverHandler();
        }
      } else {
        if (this.isHovered) {
          this.isHovered = false;
          this.unhoverHandler();
        }
      }
    });
  }

}