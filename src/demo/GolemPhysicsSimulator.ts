import { ISimulator } from "../Simulator.js";
import { GameState2D } from "../2d/GameState2D.js";
import { Golem } from "./Golem.js";
import { GOLEM_MIN_SPEED, GRAVITY, TERMINAL_VELOCITY } from "./Constants.js";


class GolemPhysicsSimulator implements ISimulator<GameState2D> {
    constructor(
            private golem: Golem) {
        this.golem = golem;
    }

    integrate(state: GameState2D, elapsedTime: number) : GameState2D {
        if (this.golem.velocity.y <= TERMINAL_VELOCITY) {
            this.golem.velocity.y += GRAVITY * elapsedTime;
        }

        if (Math.abs(this.golem.velocity.x) < GOLEM_MIN_SPEED) {
            this.golem.velocity.x = 0;
        }

        if (this.golem.velocity.x > 0) {
            this.golem.direction.x = 1;
        } else if (this.golem.velocity.x < 0) {
            this.golem.direction.x = -1;
        }

        this.golem.lastPosition.x = Math.round(this.golem.position.x);
        this.golem.lastPosition.y = Math.round(this.golem.position.y);
        this.golem.position.x += Math.round(this.golem.velocity.x * elapsedTime);
        this.golem.position.y += Math.round(this.golem.velocity.y * elapsedTime);

        return state;
    }

    interpolate = (state: GameState2D) : GameState2D => state;
}


export {
    GolemPhysicsSimulator
}