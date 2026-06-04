
import spriteManager from "../SpriteManager";
import BaseComponent from "./BaseComponent";

export default class TiledSprite extends BaseComponent {
  adjustedSpriteSize: any;
  width: number | undefined;
  height: number | undefined;

  constructor(parent:BaseComponent, spriteSize:any) {
    super(parent);
    this.withSize(parent.computeSize()).withSprite(parent.sprite);
    if (this.parent) {
      this.parent.sprite = null;
    }
    this.adjustedSpriteSize = this.cameraTransform ? this.cameraTransform({...spriteSize, x:0,y:0,r:0,s:0}) : {...spriteSize};
  }

  draw(ctx: CanvasRenderingContext2D) {
    let drawInfo = this.computeDrawInfo();
    let {h,w} = this.adjustedSpriteSize;
    let left = drawInfo.x - drawInfo.w/2, top = drawInfo.y + drawInfo.h/2 - drawInfo.h, 
      width = drawInfo.w, height = drawInfo.h;

    if (spriteManager.spritePaths[this.computeSprite()] || spriteManager.processedSprites[this.computeSprite()]) {
      let s = spriteManager.getImage(this.computeSprite());
      for (let l = left;l<left+width+w;l+=w) {
        for (let t = top;t<top+height+h;t+=h) {
          spriteManager.drawImage(ctx, s, 0, 0, s.width, s.height, l, t, w, h);
        }
      }
      return;
    }
    if (spriteManager.miniSprites[this.computeSprite()]?.sheetName) {
      let s = spriteManager.miniSprites[this.computeSprite()];
      let w = this.width ?? s.width, h = this.height ?? s.height;
      for (let l = left;l<left+width+w;l+=w) {
        for (let t = top;t<top+height+h;t+=h) {
          spriteManager.drawImage(ctx, spriteManager.getImage(spriteManager.miniSprites[this.computeSprite()].sheetName), s.left, s.top, s.width, s.height, l, t, w, h);
        }
      }
    }
  }

}