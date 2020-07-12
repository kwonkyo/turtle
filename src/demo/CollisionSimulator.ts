import { GameState2D } from "../2d/GameState2D.js";
import { ISimulator } from "../Simulator.js";
import { RectangleCollider } from "../2d/Collider2D.js";
import { Character } from "./Character.js";
import { Brick } from "./Brick.js";

class CollisionSimulator implements ISimulator<GameState2D> {
    private collider: RectangleCollider;

    constructor(
            private character: Character,
            private map: Brick[]) {
        this.character = character;
        this.map = map;

        this.collider = new RectangleCollider();
    }

    integrate(state: GameState2D, elapsedTime: number) : GameState2D {
        for (let brick of this.map) {
            if (!brick.isWall) {
                continue;
            }

            if (this.collider.didCollide(this.character, brick)) {
                let response = this.collider.resolve(
                    this.character, brick);
                
                this.character.acceptCollisionResolution(
                    response.resolveA);
                brick.acceptCollisionResolution(
                    response.resolveB);

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