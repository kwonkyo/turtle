import { ICollidable } from "../Collidable.js";
import { ICollisionBound } from "../CollisionBound.js";
import { Vector2D } from "./Vector2D.js";
import { CollisionResolution2D } from "./CollisionResolution.js";

interface ICollidable2D<T extends ICollisionBound> extends ICollidable<T>{
    position : Vector2D;
    lastPosition : Vector2D;
    velocity : Vector2D;

    getCollisionBound() : T;
    acceptCollisionResolution(resolution: CollisionResolution2D);
}


export {
    ICollidable2D
}