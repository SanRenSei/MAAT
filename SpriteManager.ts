import ImageUtil from "./util/imageUtil.ts";

class SpriteManager {
  timeOffset: number;
  sprites: Record<string, HTMLImageElement | null>;
  spritePaths: Record<string, string>;
  miniSprites: Record<string, any>;
  processedSprites: Record<string, (manager: SpriteManager) => HTMLImageElement>;


  constructor() {
    this.timeOffset = new Date().getTime();
    this.sprites = {};
    this.spritePaths = {};
    this.miniSprites = {};
    this.processedSprites = {};
  }

  hoistPaths(assetPaths:any) {
    this.spritePaths = assetPaths.spritePaths || {};
    this.miniSprites = assetPaths.miniSprites || {};
    this.processedSprites = assetPaths.processedSprites || {};
  }

  load(spriteName:any) {
    if (!this.sprites[spriteName] && this.spritePaths[spriteName]) {
      let newImage = new Image();
      this.sprites[spriteName] = newImage;
      newImage.src = this.spritePaths[spriteName];
      return;
    }
    if (!this.sprites[spriteName] && this.processedSprites[spriteName]) {
      let newImage = this.processedSprites[spriteName](this);
      this.sprites[spriteName] = newImage;
      return;
    }
  }

  storeSVG(spriteName:string, svgStr:string) {
    let newImage = new Image();
    newImage.src = 'data:image/svg+xml;charset=utf-8,' + svgStr;
    this.sprites[spriteName] = newImage;
  }

  clearSVG(spriteName:string) {
    this.sprites[spriteName] = null;
  }

  isLoaded(spriteName:string) {
    if (!this.sprites[spriteName]) {
      this.load(spriteName);
      return false;
    }
    return this.sprites[spriteName].complete;
  }

  getImage(spriteName:string) {
    if (!this.sprites[spriteName]) {
      this.load(spriteName);
    }
    return this.sprites[spriteName];
  }

  getMinisprite(spriteName:string) {
    let spriteInfo = this.miniSprites[spriteName];
    let toReturn = ImageUtil.subImage(this.getImage(spriteInfo.sheetName), spriteInfo.left, spriteInfo.top, spriteInfo.width, spriteInfo.height);
    toReturn.width = spriteInfo.width;
    toReturn.height = spriteInfo.height;
    return toReturn;
  }

  drawImage(ctx:CanvasRenderingContext2D, image:HTMLImageElement|null, sx:number, sy:number, sw:number, sh:number, dx:number, dy:number, dw:number, dh:number, r:number=0, a:number=1) {
    if (!image) {
      return;
    }
    if (r == 0) {
      ctx.globalAlpha = a;
      ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
      ctx.globalAlpha = 1;
      return;
    }

    let centerX = dx + dw / 2;
    let centerY = dy + dh / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(r);
    ctx.globalAlpha = a;
    ctx.drawImage(image, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  }

  drawSprite(ctx:CanvasRenderingContext2D, spriteName:string, left:number, top:number, width:number, height:number, rotation:number, alpha:number=1) {
    if (this.spritePaths[spriteName] || this.processedSprites[spriteName]) {
      let s = this.getImage(spriteName);
      if (!s) {
        return;
      }
      try {
        this.drawImage(ctx, s, 0, 0, s.width, s.height, left, top, width, height, rotation, alpha);
      } catch (e) {
        console.log('Unable to draw image ' + spriteName)
      }
      return;
    }
    if (this.miniSprites[spriteName]?.sheetName) {
      let s = this.miniSprites[spriteName];
      this.drawImage(ctx, this.getImage(this.miniSprites[spriteName].sheetName), s.left, s.top, s.width, s.height, left, top, width, height, rotation, alpha);
    }
  }

}

let spriteManager = new SpriteManager();
export default spriteManager;