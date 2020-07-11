import { ICollisionBound } from "./CollisionBound.js";
import { ICollidable } from "./Collidable.js";
import { ICollisionResponse } from "./CollisionResponse.js";

interface ICollider<T extends ICollisionBound, K extends ICollisionBound> {
    didCollide(a: ICollidable<T>, b: ICollidable<K>) : boolean;
    resolve(a: ICollidable<T>, b: ICollidable<K>) : ICollisionResponse;
}


export {
    ICollider
}