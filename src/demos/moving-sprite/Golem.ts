import { IModel } from "../../Model.js";
import { IAnimatable } from "../../Animatable.js";
import { Vector2D } from "../../2d/Vector2D.js";
import { IAnimationState } from "../../AnimationState.js";
import { GolemAnimationState } from "./GolemAnimationState.js";


class Golem implements IModel, IAnimatable {
    private direction: number = 1;

    constructor(
            public position: Vector2D,
            public velocity: Vector2D) {
        this.position = position;
        this.velocity = velocity;
    }

    getAnimationState(): IAnimationState {
        if (this.velocity.x === 0 && this.velocity.y === 0) {
            return this.direction === -1
                ? GolemAnimationState.IDLE_LEFT
                : GolemAnimationState.IDLE;
        }
        
        if (this.velocity.x > 0) {
            this.direction = 1;
            return GolemAnimationState.WALKING;
        }
        if (this.velocity.x < 0) {
            this.direction = -1;
            return GolemAnimationState.WALKING_LEFT;
        }
    }
}


export {
    Golem
}