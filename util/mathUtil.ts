
export default class MathUtil {

  static bound(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  static lerp (start, end, p) {
    return start + (end-start)*MathUtil.bound(p, 0, 1);
  }
  
  static lerp2v (start, end, p) {
    return {
      x: MathUtil.lerp(start.x, end.x, p),
      y: MathUtil.lerp(start.y, end.y, p)
    };
  }
  
  static add2v (vec1, vec2) {
    return {x:vec1.x+vec2.x,y:vec1.y+vec2.y};
  }
  
  static diff2v (vec1, vec2) {
    return {x:vec1.x-vec2.x,y:vec1.y-vec2.y};
  }
  
  static mult2v (vec2v, mult) {
    return {x:vec2v.x*mult,y:vec2v.y*mult,h:vec2v.h*mult,w:vec2v.w*mult};
  }
  
  static rot2v (vec2v, rot) {
    let { x, y } = vec2v;
    let cosRot = Math.cos(rot), sinRot = Math.sin(rot);
    return { x: x * cosRot - y * sinRot, y: x * sinRot + y * cosRot };
  }
  
  static set2vMag (vec2v, mag) {
    let currentMag = MathUtil.get2vMag(vec2v);
    if (currentMag === 0) {
      return { x: mag, y: 0 };
    }
    return MathUtil.mult2v(vec2v, mag/currentMag);
  }

  static get2vMagSq (vec2v) {
    let { x, y } = vec2v;
    return x * x + y * y;
  }
  
  static get2vMag (vec2v) {
    let { x, y } = vec2v;
    return Math.sqrt(x * x + y * y);
  }

  static normalize(vec2v) {
    return this.mult2v(vec2v, 1/this.get2vMag(vec2v));
  }

  static combineTransforms(t1, t2) {
    const cosR = Math.cos(t1.r), sinR = Math.sin(t1.r);
    const newX = t1.x + t2.x * cosR - t2.y * sinR;
    const newY = t1.y + t2.x * sinR + t2.y * cosR;
    return { x: newX, y: newY, r: t1.r + t2.r, s: t1.s * t2.s, w: t1.s * t2.w, h: t1.s * t2.h };
  }

  static weightedRandom(weights) {
    const totalWeight = weights.reduce((sum, weight) => sum+weight, 0);
    const random = Math.random()*totalWeight;
  
    let cumulative = 0;
    for (let i=0;i<weights.length;i++) {
      cumulative+=weights[i];
      if (random<cumulative) {
        return i;
      }
    }
  
    return weights.length - 1;
  }

  static quadraticFormula(a, b, c) {
    return (-b + Math.sqrt(b*b - 4*a*c))/(2*a);
  }
  
}