
import { spritePaths, miniSprites, processedSprites } from "../../data/assetPaths.js";
import spriteManager from "../SpriteManager.js";
import BaseComponent from "./BaseComponent.js";

export default class MaterializeUp extends BaseComponent {

  constructor(parent, duration, onComplete = () => {}) {
    super();
    this.parent = parent;
    this.withSize(parent.computeSize()).withSprite(parent.sprite).withCameraTransform(parent.cameraTransform);
    this.parent.sprite = null;
    this.duration = duration;
    this.onComplete = onComplete;
    this.startTime = new Date().getTime();
  }

  draw(ctx) {
    let progress = (new Date().getTime() - this.startTime) / this.duration;
    if (progress>1) {
      progress = 1;
    }
    let drawInfo = this.computeDrawInfo();
    let left = drawInfo.x - drawInfo.w/2, top = drawInfo.y + drawInfo.h/2 - drawInfo.h*progress, width = drawInfo.w, height = drawInfo.h*progress, rotation = drawInfo.r, alpha = 1;

    if (spritePaths[this.sprite] || processedSprites[this.sprite]) {
      let s = spriteManager.getImage(this.sprite);
      spriteManager.drawImage(ctx, s, 0, 0, s.width, s.height*progress, left, top, width, height, rotation, alpha);
      return;
    }
    if (miniSprites[this.sprite]?.sheetName) {
      let s = miniSprites[this.sprite];
      spriteManager.drawImage(ctx, spriteManager.getImage(miniSprites[this.sprite].sheetName), s.left, s.top, s.width, s.height*progress, left, top, width, height, rotation, alpha);
    }
  }

  update() {
    if (new Date().getTime() - this.startTime > this.duration) {
      this.onComplete();
      this.parent.sprite = this.sprite;
      this.purge();
    }
  }

}