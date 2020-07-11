import { ICollisionResponse } from "../CollisionResponse";
import { Vector2D } from "./Vector2D";
import { CollisionResolution2D } from "./CollisionResolution";

class CollisionResponse2D implements ICollisionResponse {
    constructor(
        public resolveA: CollisionResolution2D,
        public resolveB: CollisionResolution2D
    ) {
        this.resolveA = resolveA;
        this.resolveB = resolveB;
    }
}


export {
    CollisionResponse2D
}