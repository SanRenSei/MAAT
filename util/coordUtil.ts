import MathUtil from "./mathUtil.ts";

export default class CoordUtil {

  static applyMovement(start, target, velocity) {
    let direction = MathUtil.diff2v(target, start);
    let distance = MathUtil.get2vMag(direction);
    if (velocity >= distance) {
      return target;
    }
    return MathUtil.add2v(start, MathUtil.mult2v(direction, velocity/distance));
  }

  static scaleSize(size, scale) {
    return {w:size.w*scale, h:size.h*scale};
  }

  static hexToDraw(hex) {
    let x=0, y=0;
    y = 100*hex.y;
    x += hex.x*75;
    y += hex.x*50;
    return {x,y};
  }

  static rectRectCollision(r1, r2) {
    if (r1.r || r2.r) {
      return CoordUtil.rotRectRotRectCollision(r1, r2);
    }
    return Math.abs(r1.x-r2.x) <= r1.w/2 + r2.w/2 && Math.abs(r1.y-r2.y) <= r1.h/2 + r2.h/2
  }

  static pointInRect(p, rect) {
    return p.x>=rect.x-rect.w/2 && p.x<=rect.x+rect.w/2 && p.y>=rect.y-rect.h/2 && p.y<=rect.y+rect.h/2;
  }

  static pointInOval(p, oval) {
    return ((p.x - oval.x) ** 2) / ((oval.w / 2) ** 2) + ((p.y - oval.y) ** 2) / ((oval.h / 2) ** 2) <= 1;
  }

  static ovalRotRectCollision(oval, rotRect) {
    let dx = oval.x - rotRect.x, dy = oval.y - rotRect.y;
    let cos = Math.cos(-rotRect.r), sin = Math.sin(-rotRect.r);

    let txCircleX = dx * cos - dy * sin, txCircleY = dx * sin + dy * cos;
    let closestX = Math.max(-rotRect.w/2, Math.min(oval.x, rotRect.w/2)), closestY = Math.max(-rotRect.h/2, Math.min(oval.y, rotRect.h/2));
    return this.pointInOval({x:closestX,y:closestY}, {x:txCircleX,y:txCircleY,w:oval.w,h:oval.h});
  }

  static ovalRectCollision(oval, rect) {
    let closestX = Math.max(rect.x - rect.w / 2, Math.min(oval.x, rect.x + rect.w / 2));
    let closestY = Math.max(rect.y - rect.h / 2, Math.min(oval.y, rect.y + rect.h / 2));
    return CoordUtil.pointInOval({x:closestX, y:closestY}, oval);
  }

  static ovalOvalCollision(o1, o2) {
    let dx = o1.x - o2.x;
    let dy = o1.y - o2.y;

    let scaleX = 2 / (o1.w + o2.w);
    let scaleY = 2 / (o1.h + o2.h);

    let normalizedDistance = (dx * scaleX) ** 2 + (dy * scaleY) ** 2;
    return normalizedDistance <= 1;
  }

  static rotRectRotRectCollision(r1, r2) {
    // Step 1: Get corners of each rectangle
    const getCorners = ({ x, y, w, h, r }) => {
      const hw = w / 2, hh = h / 2;
      const cos = Math.cos(r), sin = Math.sin(r);
      
      // Relative corner positions
      const corners = [
        { x: -hw, y: -hh },
        { x:  hw, y: -hh },
        { x:  hw, y:  hh },
        { x: -hw, y:  hh }
      ];

      // Rotate and translate to world position
      return corners.map(p => ({
        x: x + p.x * cos - p.y * sin,
        y: y + p.x * sin + p.y * cos
      }));
    };

    const cornersA = getCorners(r1);
    const cornersB = getCorners(r2);

    // Step 2: Get the 4 unique axes (normals of edges)
    const getAxes = corners => {
      const axes: any[] = [];
      for (let i = 0; i < 4; i++) {
        const p1 = corners[i];
        const p2 = corners[(i + 1) % 4];
        const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
        // Perpendicular (normal)
        const normal = { x: -edge.y, y: edge.x };
        // Normalize
        const length = Math.hypot(normal.x, normal.y);
        axes.push({ x: normal.x / length, y: normal.y / length });
      }
      return axes;
    };

    const axes = [...getAxes(cornersA).slice(0, 2), ...getAxes(cornersB).slice(0, 2)];

    // Step 3: Project both rectangles onto each axis
    const project = (axis, corners) => {
      const dots = corners.map(p => p.x * axis.x + p.y * axis.y);
      return { min: Math.min(...dots), max: Math.max(...dots) };
    };

    // Step 4: Check for separation on any axis
    for (const axis of axes) {
      const projA = project(axis, cornersA);
      const projB = project(axis, cornersB);
      const separated = projA.max < projB.min || projB.max < projA.min;
      if (separated) return false; // Found a separating axis
    }

    return true; // No separating axis found → collision
  }

  static negovalOvalCollision(negOval, oval) {
    let centerDist = MathUtil.diff2v(oval, negOval);
    let farDX = centerDist.x + centerDist.x/(Math.abs(centerDist.x)+Math.abs(centerDist.y))*oval.w/2;
    let farDY = centerDist.y + centerDist.y/(Math.abs(centerDist.x)+Math.abs(centerDist.y))*oval.h/2;
    const negOvalDist = (2*farDX/negOval.w)**2 + (2*farDY/negOval.h)**2;
    return negOvalDist > 1;
  }

  static checkShapeCollision(s1, s2) {
    let collisionFuncs = {
      negOval: {
        oval: CoordUtil.negovalOvalCollision
      },
      oval: {
        oval: CoordUtil.ovalOvalCollision,
        rect: CoordUtil.ovalRectCollision
      },
      rect: {
        rect: CoordUtil.rectRectCollision
      }
    };
    if (s1.shape>s2.shape) {
      return collisionFuncs[s2.shape][s1.shape](s2, s1);
    }
    return collisionFuncs[s1.shape][s2.shape](s1, s2);
  }

  static resolveCollisionMobileRectToWallRect(mobileRect, wallRect, movementVector) {
    const dx = mobileRect.x - wallRect.x;
    const dy = mobileRect.y - wallRect.y;
    const overlapX = mobileRect.w/2 + wallRect.w/2 - Math.abs(dx);
    const overlapY = mobileRect.h/2 + wallRect.h/2 - Math.abs(dy);
    if (overlapX <= 0 || overlapY <= 0) {
      return { x:mobileRect.x,y:mobileRect.y };
    }
    let moveX = 0, moveY = 0, newDX = movementVector.x, newDY = movementVector.y;
    if (overlapX < overlapY) {
      moveX = Math.sign(dx)*overlapX;
      newDX = Math.sign(dx)*Math.abs(newDX);
    } else {
      moveY = Math.sign(dy)*overlapY;
      newDY = Math.sign(dy)*Math.abs(newDY);
    }
    return {x: mobileRect.x + moveX, y: mobileRect.y + moveY, dx: newDX, dy: newDY};
  }

  static resolveCollisionMobileRectToMobileRect(rect1, rect2, movementVector) {
    const dx = rect1.x - rect2.x;
    const dy = rect1.y - rect2.y;
    const overlapX = rect1.w/2 + rect2.w/2 - Math.abs(dx);
    const overlapY = rect1.h/2 + rect2.h/2 - Math.abs(dy);
    if (overlapX <= 0 || overlapY <= 0) {
      return [{ x:rect1.x,y:rect1.y }, { x:rect2.x,y:rect2.y }];
    }
    let moveX = 0, moveY = 0, newDX = movementVector.x, newDY = movementVector.y;
    if (overlapX < overlapY) {
      moveX = Math.sign(dx)*overlapX;
      newDX = Math.sign(dx)*Math.abs(newDX);
    } else {
      moveY = Math.sign(dy)*overlapY;
      newDY = Math.sign(dy)*Math.abs(newDY);
    }
    return [
      {x: rect1.x + moveX/2, y: rect1.y + moveY/2, dx: newDX, dy: newDY},
      {x: rect2.x - moveX/2, y: rect2.y - moveY/2, dx: newDX, dy: newDY}
    ];
  }

}