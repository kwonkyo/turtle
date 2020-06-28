import { ICollidable } from "../Collidable";
import { ICollisionBound } from "../CollisionBound";
import { Vector2D } from "./Vector2D";

interface ICollidable2D<T extends ICollisionBound> extends ICollidable<T>{
    position : Vector2D;
    lastPosition : Vector2D;
    velocity : Vector2D;

    getCollisionBound() : T;
}


export {
    ICollidable2D
}