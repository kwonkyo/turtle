import { ICollisionBound2D, RectangleCollisionBound } from "./CollisionBound2D.js";
import { ICollider } from "../Collider.js";
import { ICollidable2D } from "./Collidable2D.js";
import { Vector2D } from "./Vector2D.js";
import { CollisionResponse2D } from "./CollisionResponse.js";
import { CollisionResolution2D } from "./CollisionResolution.js";


interface ICollider2D<T extends ICollisionBound2D, K extends ICollisionBound2D> extends ICollider<T, K>{
    didCollide(a: ICollidable2D<T>, b: ICollidable2D<K>) : boolean;
    resolve(a: ICollidable2D<T>, b: ICollidable2D<K>) : CollisionResponse2D;
}


class RectangleCollider implements ICollider2D<RectangleCollisionBound, RectangleCollisionBound> {
    didCollide(a: ICollidable2D<RectangleCollisionBound>, b: ICollidable2D<RectangleCollisionBound>) : boolean {
        let aBound = a.getCollisionBound();
        let bBound = b.getCollisionBound();

        return this.checkCollision(aBound, bBound);
    }

    resolve(a: ICollidable2D<RectangleCollisionBound>, b: ICollidable2D<RectangleCollisionBound>) : CollisionResponse2D {
        let resolution = this.binarySearchResolution(
            a, b, a.position, a.lastPosition);
        
        return new CollisionResponse2D(
            new CollisionResolution2D(resolution, new Vector2D(0, 0)),
            new CollisionResolution2D(b.position, b.velocity));
    }

    private binarySearchResolution(
            a: ICollidable2D<RectangleCollisionBound>, b: ICollidable2D<RectangleCollisionBound>,
            position: Vector2D, lastPosition: Vector2D) : Vector2D {
        let oldBound = a.getCollisionBound();
        let bBound = b.getCollisionBound();
        
        let newBound = new RectangleCollisionBound(
            position,
            position.add(new Vector2D(oldBound.width, 0)),
            position.add(new Vector2D(oldBound.width, oldBound.height)),
            position.add(new Vector2D(0, oldBound.height)));
        
        if (!this.checkCollision(newBound, bBound)) {
            return position;
        }

        let interpolatedPosition = position.interpolate(lastPosition, 0.5);

        return this.binarySearchResolution(a, b, interpolatedPosition, lastPosition);
    }

    private checkCollision(aBound: RectangleCollisionBound, bBound: RectangleCollisionBound) {
        return (
            Math.round(aBound.right) >= Math.round(bBound.left) &&
            Math.round(aBound.left) <= Math.round(bBound.right) &&
            Math.round(aBound.bottom) >= Math.round(bBound.top) &&
            Math.round(aBound.top) <= Math.round(bBound.bottom)
        );
    }
}


export {
    ICollider2D,
    RectangleCollider
}