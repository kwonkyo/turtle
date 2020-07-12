import { ISimulator } from "../Simulator.js";
import { GameState2D } from "../2d/GameState2D.js";
import { Character } from "./Character.js";
import {
    CHARACTER_IDLE_SPEED, TERMINAL_VELOCITY, GROUND_FRICTION,
    AIR_FRICTION, 
    CHARACTER_ACCELERATION} from "./Constants.js";
import { IWorld } from "./World.js";


class CharacterPhysicsSimulator implements ISimulator<GameState2D> {
    constructor(
            private character: Character,
            private world: IWorld) {
        this.character = character;
        this.world = world;
    }

    integrate(state: GameState2D, elapsedTime: number) : GameState2D {
        let collisionBound = this.character.getCollisionBound();
        this.character.gravity = Math.min(
            this.world.getGravity(collisionBound.lowerLeft),
            this.world.getGravity(collisionBound.lowerRight));
        
        if (!this.character.onSurface()) {
            this.character.velocity.x /= AIR_FRICTION;
        } else {
            this.character.velocity.x /= GROUND_FRICTION;
        }

        if (Math.abs(this.character.velocity.x) <= CHARACTER_IDLE_SPEED) {
            this.character.velocity.x = 0;
        }

        if (this.character.velocity.y <= TERMINAL_VELOCITY) {
            this.character.velocity.y += this.character.gravity * elapsedTime;
        }

        if (this.character.velocity.x > 0) {
            this.character.direction.x = 1;
        } else if (this.character.velocity.x < 0) {
            this.character.direction.x = -1;
        }

        this.character.lastPosition.x = Math.round(this.character.position.x);
        this.character.lastPosition.y = Math.round(this.character.position.y);
        this.character.position.x += Math.round(this.character.velocity.x * elapsedTime);
        this.character.position.y += Math.round(this.character.velocity.y * elapsedTime);

        return state;
    }

    interpolate = (state: GameState2D) : GameState2D => state;
}


export {
    CharacterPhysicsSimulator
}