
import collider from "../event/Collider.js";
import CoordUtil from "../util/coordUtil.js";
import MathUtil from "../util/mathUtil.js";
import BaseComponent from "./BaseComponent.js";

interface CollisionShapeOptions {
  tags?: string | string[];
  collidesWith?: string | string[];
}

export default class CollisionShape extends BaseComponent {
  parent: BaseComponent;
  shape: string;
  type: string;
  tags: string[];
  collidesWith: string[];

  constructor(parent:BaseComponent, shape:string, type:string, {tags, collidesWith}: CollisionShapeOptions = {}) {
    super();
    this.parent = parent;
    this.shape = shape;
    this.type = type;
    if (typeof tags == 'string') {
      tags = [tags];
    }
    if (typeof collidesWith == 'string') {
      collidesWith = [collidesWith];
    }
    this.tags = tags || [];
    this.collidesWith = collidesWith || [];
    this.withSize(parent.computeSize());
    this.takeTransformSnapshot();
    collider.addShape(this);
  }

  getCollisionShape() {
    return {shape: this.shape, ...this.transformSnapshot};
  }

  hasTag(tag:string) {
    return this.tags.includes(tag);
  }

  purge() {
    collider.removeShape(this);
  }

  static resolveComponentCollisionMobileRectMobileRect(component1:any, component2:any) {
    let [res1, res2] = CoordUtil.resolveCollisionMobileRectToMobileRect(component1.getRectShape(), component2.getRectShape(), {x:0,y:0});
    component1.withPosition(MathUtil.add2v(component1.position, MathUtil.diff2v(res1, component1.transformSnapshot)));
    component2.withPosition(MathUtil.add2v(component2.position, MathUtil.diff2v(res2, component2.transformSnapshot)));
  }

  static resolveComponentCollisionMobileRectWallRect(component1:any, component2:any) {
    let res = CoordUtil.resolveCollisionMobileRectToWallRect(component1.getRectShape(), component2.getRectShape(), {x:0,y:0});
    component1.withPosition(MathUtil.add2v(component1.position, MathUtil.diff2v(res, component1.transformSnapshot)));
  }

}