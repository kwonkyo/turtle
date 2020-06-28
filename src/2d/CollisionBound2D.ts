import { ICollisionBound } from "../CollisionBound.js";
import { Vector2D } from "./Vector2D.js";


class ICollisionBound2D implements ICollisionBound {}

class RectangleCollisionBound implements ICollisionBound2D {
    constructor(
        public upperLeft: Vector2D,
        public upperRight: Vector2D,
        public lowerRight: Vector2D,
        public lowerLeft: Vector2D
    ) {
        this.upperLeft = upperLeft;
        this.upperRight = upperRight;
        this.lowerRight = lowerRight;
        this.lowerLeft = lowerLeft;
    }

    get left() : number {
        return this.upperLeft.x;
    }

    get right() : number {
        return this.upperRight.x;
    }

    get top() : number {
        return this.upperRight.y;
    }

    get bottom() : number {
        return this.lowerRight.y;
    }

    get width() : number {
        return this.right - this.left;
    }

    get height() : number {
        return this.bottom - this.top;
    }
}


export {
    ICollisionBound2D,
    RectangleCollisionBound
}