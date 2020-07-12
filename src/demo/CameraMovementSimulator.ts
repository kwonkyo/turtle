import { ISimulator } from "../Simulator.js";
import { GameState2D } from "../2d/GameState2D.js";
import { linearInterpolate } from "../Math.js";
import { ICamera2D } from "../2d/Camera2D.js";
import { Character } from "./Character.js";


class CameraMovementSimulator implements ISimulator<GameState2D> {
    constructor(
            private camera: ICamera2D,
            private character: Character,
            private unitLength: number,
            private mapRows: number,
            private mapColumns: number) {
        this.camera = camera;
        this.character = character;
        this.unitLength = unitLength;
        this.mapRows = mapRows;
        this.mapColumns = mapColumns;
        
    }

    integrate(state: GameState2D, elapsedTime: number): GameState2D {
        this.camera.position.x = linearInterpolate(
            this.camera.position.x,
            this.character.position.x - this.camera.width / 3,
            0.1
        );
        this.camera.position.x = Math.min(
            Math.max(0, this.camera.position.x),
            this.mapColumns * this.unitLength - this.camera.width
        );

        this.camera.position.y = linearInterpolate(
            this.camera.position.y,
            this.character.position.y - this.camera.height / 3,
            0.1
        );
        this.camera.position.y = Math.min(
            Math.max(0, this.camera.position.y),
            this.mapRows * this.unitLength - this.camera.height
        );

        return state;
    }

    interpolate = (state: GameState2D, target: GameState2D, percent: number) : GameState2D => state;
}


export {
    CameraMovementSimulator
}