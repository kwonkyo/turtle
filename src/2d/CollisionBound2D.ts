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
        return this.upperLeft.y;
    }

    get bottom() : number {
        return this.lowerLeft.y;
    }

    get center() : Vector2D {
        let size = this.lowerRight.subtract(this.upperLeft);
        let center = this.upperLeft.add(
            new Vector2D(size.x / 2, size.y / 2));

        return center;
    }
}


export {
    ICollisionBound2D,
    RectangleCollisionBound
}