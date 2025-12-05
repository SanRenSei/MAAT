
import collider from "../event/Collider.js";
import CoordUtil from "../util/coordUtil.js";
import MathUtil from "../util/mathUtil.js";
import BaseComponent from "./BaseComponent.js";

export default class CollisionShape extends BaseComponent {

  constructor(parent, shape, type, {tags, collidesWith}) {
    super();
    this.parent = parent;
    this.shape = shape;
    this.type = type;
    this.tags = tags || [];
    this.collidesWith = collidesWith || [];
    this.withSize(parent.computeSize());
    this.takeTransformSnapshot();
    collider.addShape(this);
  }

  getCollisionShape() {
    return {shape: this.shape, ...this.transformSnapshot};
  }

  hasTag(tag) {
    return this.tags.includes(tag);
  }

  purge() {
    collider.removeShape(this);
  }

  static resolveComponentCollisionMobileRectMobileRect(component1, component2) {
    let [res1, res2] = CoordUtil.resolveCollisionMobileRectToMobileRect(component1.getRectShape(), component2.getRectShape(), {x:0,y:0});
    component1.withPosition(MathUtil.add2v(component1.position, MathUtil.diff2v(res1, component1.transformSnapshot)));
    component2.withPosition(MathUtil.add2v(component2.position, MathUtil.diff2v(res2, component2.transformSnapshot)));
  }

  static resolveComponentCollisionMobileRectWallRect(component1, component2) {
    let res = CoordUtil.resolveCollisionMobileRectToWallRect(component1.getRectShape(), component2.getRectShape(), {x:0,y:0});
    component1.withPosition(MathUtil.add2v(component1.position, MathUtil.diff2v(res, component1.transformSnapshot)));
  }

}