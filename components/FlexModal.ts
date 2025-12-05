import CoordUtil from "../util/coordUtil";
import BaseComponent from "./BaseComponent";

export default class FlexModal extends BaseComponent {
  scrollHeight: number;
  dragging: boolean;
  lastDragY: number;

  constructor(parent) {
    super(parent);
    this.scrollHeight = 0;
    this.dragging = false;
    this.lastDragY = 0;
    this.subscribeTo('wheel', e => this.onWheel(e));
    this.subscribeTo('pointerdown', e => this.onPointerDown(e));
    this.subscribeTo('pointermove', e => this.onPointerMove(e));
    this.subscribeTo('pointerup', e => this.onPointerUp(e));
    this.subscribeTo('pointercancel', e => this.onPointerUp(e));
  }

  draw(ctx) {
    if (!this.display) {
      return;
    }
    let { x, y, w, h } = this.computeDrawInfo();
    ctx.save();
    ctx.beginPath();
    ctx.rect(x - w/2, y - h/2, w, h);
    ctx.clip();
    super.draw(ctx);
    ctx.restore();
  }

  reflex() {
    let {x,y,w,h} = this.transformSnapshot;
    let currentY = - h/2 - this.scrollHeight;
    let currentRow:BaseComponent[] = [];
    let rowWidth = 0;
    let rowHeight = 0;
    const applyRow = () => {
      let currentX = -rowWidth/2;
      for (let j=0;j<currentRow.length;j++) {
        currentX += currentRow[j].transformSnapshot.w/2;
        currentRow[j].withPosition({x:currentX, y: currentY + rowHeight/2});
        currentX += currentRow[j].transformSnapshot.w/2;
      }
    }
    for (let i=0;i<this.children.length;i++) {
      let child = this.children[i];
      let childTransform = child.takeTransformSnapshot();
      let newRowWidth = rowWidth + childTransform.w;
      if (rowWidth==0 || newRowWidth <= w) {
        currentRow.push(child);
        rowWidth += childTransform.w;
        rowHeight = Math.max(rowHeight, childTransform.h);
      } else {
        applyRow();
        currentY += rowHeight;
        currentRow = [child];
        rowWidth = childTransform.w;
        rowHeight = childTransform.h;
      }
    }
    applyRow();
  }

  onWheel(evt) {
    this.scrollHeight += evt.deltaY;
    if (this.scrollHeight < 0) {
      this.scrollHeight = 0;
    }
    this.reflex();
  }

  onPointerDown(evt) {
    if (CoordUtil.pointInRect({ x: evt.translatedX, y: evt.translatedY },{...this.transformSnapshot})) {
      this.dragging = true;
      this.lastDragY = evt.translatedY;
    }
  }

  onPointerMove(evt) {
    if (evt.buttons==0) {
      this.dragging = false;
    }
    if (this.dragging) {
      let dy = evt.translatedY - this.lastDragY;
      this.scrollHeight -= dy;
      if (this.scrollHeight < 0) {
        this.scrollHeight = 0;
      }
      this.reflex();
      this.lastDragY = evt.translatedY;
    }
  }

  onPointerUp(evt) {
    this.dragging = false;
  }

}