import { ISimulator } from "../../Simulator.js";
import { GameState2D } from "../../2d/GameState2D.js";
import { IAnimator, Animator } from "../../Animator.js";
import { Golem } from "./Golem.js";
import { GolemFrame } from "./GolemFrame.js";
import { FLOOR_FRICTION, GOLEM_MIN_SPEED, GRAVITY, TERMINAL_VELOCITY } from "./Constants.js";


class GolemPhysicsSimulator implements ISimulator<GameState2D> {
    constructor(
            private golem: Golem,
            private callback: () => void) {
        this.golem = golem;
    }

    integrate(state: GameState2D, elapsedTime: number) : GameState2D {
        this.golem.velocity.x /= FLOOR_FRICTION;
        if (Math.abs(this.golem.velocity.x) < GOLEM_MIN_SPEED) {
            this.golem.velocity.x = 0.;
        }

        this.golem.velocity.y += GRAVITY * elapsedTime;
        if (Math.abs(this.golem.velocity.y) > TERMINAL_VELOCITY) {
            this.golem.velocity.y = 0.;
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
        console.log([this.golem.position.x, this.golem.position.y]);

        this.callback();

        return state;
    }

    interpolate = (state: GameState2D, target: GameState2D, percent: number) : GameState2D => state;
}


export {
    GolemPhysicsSimulator
}