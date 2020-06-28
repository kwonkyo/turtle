import { ICollisionBound2D, RectangleCollisionBound } from "./CollisionBound2D.js";
import { ICollider } from "../Collider.js";
import { ICollidable2D } from "./Collidable2D.js";
import { Vector2D } from "./Vector2D.js";


interface ICollider2D<T extends ICollisionBound2D, K extends ICollisionBound2D> extends ICollider<T, K>{
    didCollide(a: ICollidable2D<T>, b: ICollidable2D<K>) : boolean;
    resolve(a: ICollidable2D<T>, b: ICollidable2D<K>);
}


class RectangleCollider implements ICollider2D<RectangleCollisionBound, RectangleCollisionBound> {
    didCollide(a: ICollidable2D<RectangleCollisionBound>, b: ICollidable2D<RectangleCollisionBound>): boolean {
        let aBound = a.getCollisionBound();
        let bBound = b.getCollisionBound();

        return this.checkCollision(aBound, bBound);
    }

    resolve(a: ICollidable2D<RectangleCollisionBound>, b: ICollidable2D<RectangleCollisionBound>) {
        let resolution = this.binarySearchResolution(
            a, b, a.position, a.lastPosition);

        a.lastPosition.x = resolution.x;
        a.lastPosition.y = resolution.y;
        a.position.x = resolution.x;
        a.position.y = resolution.y;
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