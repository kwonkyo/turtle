import { ISimulator } from "../../Simulator.js";
import { GameState2D } from "../../2d/GameState2D.js";
import { IAnimator, Animator } from "../../Animator.js";
import { Golem } from "./Golem.js";
import { GolemAnimation } from "./GolemAnimation.js";
import { FLOOR_FRICTION, GOLEM_MIN_SPEED } from "./Constants.js";


class GolemPhysicsSimulator implements ISimulator<GameState2D> {
    private animator: IAnimator<Golem, GolemAnimation>;

    constructor(
            private golem: Golem,
            private golemAnimation: GolemAnimation) {
        this.animator = new Animator();
        this.golem = golem;
        this.golemAnimation = golemAnimation;
    }

    integrate(state: GameState2D, elapsedTime: number) : GameState2D {
        this.animator.animate(this.golem, this.golemAnimation);

        this.golem.position.x += this.golem.velocity.x * elapsedTime;
        this.golem.position.y += this.golem.velocity.y * elapsedTime;

        this.golem.velocity.x /= FLOOR_FRICTION;
        if (Math.abs(this.golem.velocity.x) < GOLEM_MIN_SPEED) {
            this.golem.velocity.x = 0.;
        }

        this.golem.velocity.y /= FLOOR_FRICTION;
        if (Math.abs(this.golem.velocity.y) < GOLEM_MIN_SPEED) {
            this.golem.velocity.y = 0.;
        }

        return state;
    }

    interpolate = (state: GameState2D, target: GameState2D, percent: number) : GameState2D => state;
}


export {
    GolemPhysicsSimulator
}