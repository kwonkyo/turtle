import { ICollisionBound } from "./CollisionBound";
import { ICollidable } from "./Collidable";
import { IVector } from "./Math";

interface ICollider<T extends ICollisionBound, K extends ICollisionBound> {
    didCollide(a: ICollidable<T>, b: ICollidable<K>) : boolean;
    resolve(a: ICollidable<T>, b: ICollidable<K>) : IVector;
}


export {
    ICollider
}