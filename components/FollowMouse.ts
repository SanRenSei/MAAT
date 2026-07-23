
import MathUtil from '../util/mathUtil.js';
import BaseComponent from './BaseComponent.js';

export default class FollowMouse extends BaseComponent {
  declare parent: BaseComponent;

  constructor(parent:BaseComponent) {
    super(parent);
    this.subscribeTo('pointermove', (e:any) => {
      this.parent.position = MathUtil.add2v(this.parent.position, MathUtil.diff2v({x:e.translatedX, y:e.translatedY}, this.parent.transformSnapshot));
    });
  }

}