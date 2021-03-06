import { IAnimatedModel } from "../AnimatedModel.js";
import { Vector2D } from "../2d/Vector2D.js";
import { IAnimationState } from "../AnimationState.js";
import { CharacterAnimationState } from "./CharacterAnimationState.js";
import { RectangleCollisionBound } from "../2d/CollisionBound2D.js";
import { CHARACTER_DISPLAY_WIDTH, CHARACTER_DISPLAY_HEIGHT, GRAVITY } from "./Constants.js";
import { ICollidable2D } from "../2d/Collidable2D.js";
import { CollisionResolution2D } from "../2d/CollisionResolution.js";


class Character implements IAnimatedModel, ICollidable2D<RectangleCollisionBound>{
    lastPosition: Vector2D;
    direction: Vector2D = new Vector2D(1, 1);

    constructor(
            public position: Vector2D,
            public velocity: Vector2D,
            public gravity: number=GRAVITY,
            public width: number=CHARACTER_DISPLAY_WIDTH,
            public height: number=CHARACTER_DISPLAY_HEIGHT) {
        this.position = position;
        this.lastPosition = position.copy();
        this.velocity = velocity;
    }

    getAnimationState(): IAnimationState {
        let leftward = this.direction.x == -1;
        if (Math.abs(this.velocity.x) > 0) {
            return leftward
                ? CharacterAnimationState.WALKING_LEFT
                : CharacterAnimationState.WALKING_RIGHT;
        }

        return leftward
            ? CharacterAnimationState.IDLE_LEFT
            : CharacterAnimationState.IDLE_RIGHT;
    }

    getCollisionBound(): RectangleCollisionBound {
        return new RectangleCollisionBound(
            this.position,
            this.position.add(new Vector2D(this.width, 0)),
            this.position.add(new Vector2D(this.width, this.height)),
            this.position.add(new Vector2D(0, this.height))
        )
    }

    acceptCollisionResolution(resolution: CollisionResolution2D) {
        let offset = resolution.position.subtract(this.position);
        if (Math.abs(offset.y) > Math.abs(offset.x) && offset.y < 0) {
            // If collision response is upwards, then we've landed on the ground
            this.gravity = 0;
        }

        this.position.x = resolution.position.x;
        this.position.y = resolution.position.y;
        this.lastPosition.x = resolution.position.x;
        this.lastPosition.y = resolution.position.y;
        
        // Disable velocity in the colliding dimension
        if (Math.abs(offset.y) > Math.abs(offset.x)) {
            this.velocity.y = resolution.velocity.y;
        } else {
            this.velocity.x = resolution.velocity.x;
        }
    }

    onSurface() {
        return this.gravity === 0;
    }
}


export {
    Character
}