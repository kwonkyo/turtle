import { ICollisionBound } from "./CollisionBound.js";
import { IVector } from "./Math.js";

interface ICollidable<T extends ICollisionBound> {
    position : IVector;
    lastPosition : IVector;

    getCollisionBound() : T;
}


export {
    ICollidable
}