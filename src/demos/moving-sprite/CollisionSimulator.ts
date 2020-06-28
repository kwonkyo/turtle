import { GameState2D } from "../../2d/GameState2D.js";
import { ISimulator } from "../../Simulator.js";
import { RectangleCollider } from "../../2d/Collider2D.js";
import { Golem } from "./Golem.js";
import { Brick } from "./Brick.js";

class CollisionSimulator implements ISimulator<GameState2D> {
    private collider: RectangleCollider;

    constructor(
            private golem: Golem,
            private map: Brick[]) {
        this.golem = golem;
        this.map = map;

        this.collider = new RectangleCollider();
    }

    integrate(state: GameState2D, elapsedTime: number) : GameState2D {
        for (let brick of this.map) {
            if (!brick.isWall) {
                continue;
            }

            if (this.collider.didCollide(this.golem, brick)) {
                this.collider.resolve(this.golem, brick);
                break;
            }
        }

        return state;
    }

    interpolate = (state: GameState2D) : GameState2D => state;
}


export {
    CollisionSimulator
}