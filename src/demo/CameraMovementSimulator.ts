import { ISimulator } from "../Simulator.js";
import { GameState2D } from "../2d/GameState2D.js";
import { GolemAnimationState } from "./GolemAnimationState.js";
import { linearInterpolate } from "../Math.js";
import { ICamera2D } from "../2d/Camera2D.js";
import { Golem } from "./Golem.js";


class CameraMovementSimulator implements ISimulator<GameState2D> {
    constructor(
            private camera: ICamera2D,
            private golem: Golem,
            private unitLength: number,
            private mapRows: number,
            private mapColumns: number) {
        this.camera = camera;
        this.golem = golem;
        this.unitLength = unitLength;
        this.mapRows = mapRows;
        this.mapColumns = mapColumns;
        
    }

    integrate(state: GameState2D, elapsedTime: number): GameState2D {
        this.camera.position.x = linearInterpolate(
            this.camera.position.x,
            this.golem.position.x - this.camera.width / 3,
            0.1
        );
        this.camera.position.x = Math.min(
            Math.max(0, this.camera.position.x),
            this.mapColumns * this.unitLength - this.camera.width
        );

        this.camera.position.y = linearInterpolate(
            this.camera.position.y,
            this.golem.position.y - this.camera.height / 3,
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