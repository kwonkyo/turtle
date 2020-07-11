import { ICollisionResolution } from "../CollisionResolution";
import { Vector2D } from "./Vector2D";

class CollisionResolution2D implements ICollisionResolution {
    position: Vector2D;
    velocity: Vector2D;

    constructor(
        position: Vector2D,
        velocity: Vector2D) {
            this.position = position;
            this.velocity = velocity;
        }
}


export {
    CollisionResolution2D
}