import { ICollidable } from "../Collidable.js";
import { Vector2D } from "./Vector2D.js";
import { ICollisionBound2D, RectangleCollisionBound } from "./CollisionBound2D.js";


interface ICollider2D<T extends ICollisionBound2D, K extends ICollisionBound2D> {
    didCollide(a: ICollidable<T>, b: ICollidable<K>) : boolean;
    resolve(a: ICollidable<T>, b: ICollidable<K>) : Vector2D;
}


class RectangleCollider implements ICollider2D<RectangleCollisionBound, RectangleCollisionBound> {
    didCollide(a: ICollidable<RectangleCollisionBound>, b: ICollidable<RectangleCollisionBound>): boolean {
        let aBound = a.getCollionBound();
        let bBound = b.getCollionBound();

        return (
            bBound.left <= aBound.right && aBound.right <= bBound.right ||
            bBound.left <= aBound.left && aBound.left <= bBound.right ||
            bBound.top <= aBound.top && aBound.top <= bBound.bottom ||
            bBound.top <= aBound.bottom && aBound.bottom <= bBound.bottom
        )
    }

    resolve(a: ICollidable<RectangleCollisionBound>, b: ICollidable<RectangleCollisionBound>) : Vector2D {
        let aBound = a.getCollionBound();
        let bBound = b.getCollionBound();

        if (bBound.left <= aBound.right && aBound.right <= bBound.right) {
            return new Vector2D(aBound.right - bBound.left, 0);
        } else if (bBound.left <= aBound.left && aBound.left <= bBound.right) {
            return new Vector2D(aBound.left - bBound.right, 0);
        } else if (bBound.top <= aBound.top && aBound.top <= bBound.bottom) {
            return new Vector2D(0, bBound.top - aBound.bottom);
        } else {
            return new Vector2D(0, aBound.bottom - bBound.top);
        }
    }
}


export {
    ICollider2D,
    RectangleCollider
}