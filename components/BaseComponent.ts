
import eventDispatcher from '../event/Dispatcher.ts';
import MathUtil from '../util/mathUtil.ts';
import drawManager from '../DrawManager.ts';
import spriteManager from '../SpriteManager.ts';
import evalOrGet from '../util/evalOrGet.ts';

export default class BaseComponent {
  parent: BaseComponent|null;
  cameraTransform: any;
  alpha: number;
  children: BaseComponent[];
  display: boolean|(() => boolean);
  drawPriority: number;
  absolutePosition: boolean;
  position: {x:number,y:number}|(() => {x:number,y:number});
  rotation: number;
  scale: number;
  size: {w:number,h:number}|(() => {w:number,h:number});
  sprite: string|(() => string)|null;
  subscriptions: Set<any>;
  transformSnapshot: {x:number,y:number,s:number,w:number,h:number,r:number};

  constructor(parent:BaseComponent|null=null) {
    this.parent = parent;
    this.cameraTransform = parent?.cameraTransform;
    this.alpha = 1;
    this.children = [];
    this.display = true;
    this.drawPriority = 0;
    this.absolutePosition = false;
    this.position = {x:0,y:0};
    this.rotation = 0;
    this.scale = 1;
    this.size = {w:1,h:1};
    this.sprite = null;
    this.subscriptions = new Set();
    this.transformSnapshot = {x:0,y:0,s:1,w:1,h:1,r:0};
  }

  static createSprite(spriteName, transform) {
    return new BaseComponent().withSprite(spriteName).withTransform(transform);
  }

  withAlpha(alpha) {
    this.alpha = alpha;
    return this;
  }

  withChild(child) {
    this.addChild(child);
    return this;
  }

  withDisplay(d) {
    this.display = d;
    return this;
  }

  withPriority(p) {
    this.drawPriority = p;
    return this;
  }

  withAbsolutePosition() {
    this.absolutePosition = true;
    return this;
  }

  withPosition(initialPosition:any) {
    this.position = initialPosition;
    this.takeTransformSnapshot();
    return this;
  }

  withCameraTransform(cameraTransform:any) {
    if (!cameraTransform) {
      return;
    }
    if (typeof cameraTransform == 'function') {
      this.cameraTransform = cameraTransform;
      return this;
    }
    this.cameraTransform = (coords:any) => {
      let {x,y,w,h,s,r} = coords;
      let drawWidth = 800, drawHeight = 600;
      return {
        x : drawWidth/2 + drawWidth*(x-cameraTransform.x)/cameraTransform.w,
        y : drawHeight/2 + drawHeight*(y-cameraTransform.y)/cameraTransform.h,
        w : w/cameraTransform.w*drawWidth,
        h : h/cameraTransform.h*drawHeight,
        s, r
      };
    }
    return this;
  }

  withRotation(initialRotation:any) {
    this.rotation = initialRotation;
    return this;
  }

  withTransform({x=0, y=0, r=0, w=0, h=0}) {
    this.withPosition({x,y});
    this.withSize({w,h});
    this.withRotation(r);
    return this;
  }

  withSize(initialSize:any) {
    if (typeof initialSize == 'number') {
      initialSize = {w:initialSize, h:initialSize};
    }
    this.size = initialSize;
    this.takeTransformSnapshot();
    return this;
  }

  withSprite(initialSprite:any) {
    this.sprite = initialSprite;
    return this;
  }

  computeRelativePosition() {
    return typeof this.position=='function'?this.position():this.position;
  }

  computeDrawInfo() {
    return this.applyCamera(this.transformSnapshot);
  }

  applyCamera(pos) {
    if (this.cameraTransform) {
      return this.cameraTransform(pos);
    }
    return pos;
  }

  computeWidth() {
    let width = evalOrGet(this.size);
    if (typeof width=='object') {
      width = width.w;
    }
    return width;
  }

  computeHeight() {
    let height = evalOrGet(this.size);
    if (typeof height=='object') {
      height = height.h;
    }
    return height;
  }

  computeSize() {
    return {w:this.computeWidth(), h:this.computeHeight()};
  }

  takeTransformSnapshot() {
    if (!this.parent || this.absolutePosition) {
      this.transformSnapshot = {...this.computeRelativePosition(), ...this.computeSize(), r: this.rotation, s: this.scale};
    } else {
      let parentTransform = this.parent.transformSnapshot;
      this.transformSnapshot = MathUtil.combineTransforms(parentTransform, {...this.computeRelativePosition(), ...this.computeSize(), r: this.rotation, s: this.scale});
    }
    this.children.forEach(c => c.takeTransformSnapshot());
    return this.transformSnapshot;
  }

  computeSprite():string {
    return evalOrGet(this.sprite);
  }

  draw(ctx, queued = false) {
    if (!this.display) {
      return;
    }
    if (this.drawPriority && !queued) {
      drawManager.addToDrawQueue(this);
      return;
    }
    if (evalOrGet(this.display)) {
      if (this.computeSprite()!=null) {
        let drawInfo = this.computeDrawInfo();
        spriteManager.drawSprite(ctx, this.computeSprite(), drawInfo.x - drawInfo.w/2, drawInfo.y - drawInfo.h/2, drawInfo.w, drawInfo.h, drawInfo.r, this.alpha);
      }
    }
    this.children.forEach(c => c.draw(ctx));
  }

  getRectShape() {
    return {...this.transformSnapshot,shape:'rect'};
  }

  update() {
    this.children.forEach(c => c.update());
  }

  subscribeTo(evtType, evtHandler) {
    eventDispatcher.subscribeTo(evtType, evtHandler);
    this.subscriptions.add({type:evtType, handler: evtHandler});
  }

  checkMouseIntersect(mouse) {
    let {x,y,w,h} = this.transformSnapshot;
    if (mouse.translatedX >= x-w/2 && mouse.translatedX <= x+w/2 && mouse.translatedY >= y-h/2 && mouse.translatedY <= y+h/2) {
      return true;
    }
    return false;
  }

  addChild(c) {
    this.children.push(c);
    c.parent = this;
    return c;
  }

  addChildren(children) {
    children.forEach(c => this.addChild(c));
  }

  removeChild(c) {
    this.children = this.children.filter(ch => ch!=c);
  }

  findChildrenOfType<T extends BaseComponent>(clazz: new (...args: any[]) => T): T[] {
    return this.children.filter((c): c is T => c instanceof clazz);
  }

  sterilize() {
    this.children.forEach(c => c.purge());
  }

  purge() {
    this.sterilize();
    this.subscriptions.forEach(s => {
      eventDispatcher.unsubscribeFrom(s.type, s.handler);
    })
    this.parent && this.parent.removeChild(this);
  }

}