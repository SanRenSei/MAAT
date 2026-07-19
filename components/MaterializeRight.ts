
import spriteManager from "../SpriteManager.js";
import BaseComponent from "./BaseComponent.js";

export default class MaterializeRight extends BaseComponent {
  parent: BaseComponent;
  duration: number;
  onComplete: any;
  startTime: number;

  constructor(parent:BaseComponent, duration:number, onComplete = () => {}) {
    super();
    this.parent = parent;
    this.withSize(parent.computeSize()).withSprite(parent.sprite).withCameraTransform(parent.cameraTransform);
    this.parent.sprite = null;
    this.duration = duration;
    this.onComplete = onComplete;
    this.startTime = new Date().getTime();
  }

  draw(ctx:any) {
    let progress = (new Date().getTime() - this.startTime) / this.duration;
    if (progress>1) {
      progress = 1;
    }
    let drawInfo = this.computeDrawInfo();
    let left = drawInfo.x - drawInfo.w / 2, top = drawInfo.y - drawInfo.h / 2, width = drawInfo.w * progress, height = drawInfo.h, rotation = drawInfo.r, alpha = 1;
    
    if (spriteManager.spritePaths[this.computeSprite()] || spriteManager.processedSprites[this.computeSprite()]) {
      let s = spriteManager.getImage(this.computeSprite());
      if (s) {
        spriteManager.drawImage(ctx,s,0, 0,s.width * progress, s.height,left, top,width, height,rotation,alpha);
      }
      return;
    }
    if (spriteManager.miniSprites[this.computeSprite()]?.sheetName) {
      let s = spriteManager.miniSprites[this.computeSprite()];
      spriteManager.drawImage(ctx,spriteManager.getImage(spriteManager.miniSprites[this.computeSprite()].sheetName),s.left, s.top,s.width * progress, s.height,left, top,width, height,rotation,alpha);
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