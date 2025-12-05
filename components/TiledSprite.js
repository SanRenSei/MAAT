
import { spritePaths, miniSprites, processedSprites } from "../../data/assetPaths.js";
import spriteManager from "../SpriteManager.js";
import BaseComponent from "./BaseComponent.js";

export default class TiledSprite extends BaseComponent {

  constructor(parent, spriteSize) {
    super(parent);
    this.withSize(parent.computeSize()).withSprite(parent.sprite);
    this.parent.sprite = null;
    this.adjustedSpriteSize = this.cameraTransform ? this.cameraTransform({...spriteSize, x:0,y:0,r:0,s:0}) : {...spriteSize};
  }

  draw(ctx) {
    let drawInfo = this.computeDrawInfo();
    let {h,w} = this.adjustedSpriteSize;
    let left = drawInfo.x - drawInfo.w/2, top = drawInfo.y + drawInfo.h/2 - drawInfo.h, 
      width = drawInfo.w, height = drawInfo.h;

    if (spritePaths[this.sprite] || processedSprites[this.sprite]) {
      let s = spriteManager.getImage(this.sprite);
      for (let l = left;l<left+width+w;l+=w) {
        for (let t = top;t<top+height+h;t+=h) {
          spriteManager.drawImage(ctx, s, 0, 0, s.width, s.height, l, t, w, h);
        }
      }
      return;
    }
    if (miniSprites[this.sprite]?.sheetName) {
      let s = miniSprites[this.sprite];
      let w = this.width || s.width, h = this.height || s.height;
      for (let l = left;l<left+width+w;l+=w) {
        for (let t = top;t<top+height+h;t+=h) {
          spriteManager.drawImage(ctx, spriteManager.getImage(miniSprites[this.sprite].sheetName), s.left, s.top, s.width, s.height, l, t, w, h);
        }
      }
    }
  }

}