import BaseComponent from "./BaseComponent";

export default class FlexBox extends BaseComponent {

  reflex() {
    let {w,h} = this.transformSnapshot;
    let currentY = 0;
    let currentRow = [];
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

}