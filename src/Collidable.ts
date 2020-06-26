import { ICollisionBound } from "./CollisionBound.js";

interface ICollidable<T extends ICollisionBound> {
    getCollionBound() : T;
}


export {
    ICollidable
}