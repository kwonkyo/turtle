import { IGameState } from '../GameState.js';
import { GameStatus } from '../GameStatus.js';
import { Vector2D } from './Vector2D.js';


class GameState2D implements IGameState {
    constructor(
            public map: number[],
            public widthInTiles: number,
            public heightInTiles: number,
            public status: GameStatus,
            public cameraPosition: Vector2D) {
        this.map = map;
        this.widthInTiles = widthInTiles;
        this.heightInTiles = heightInTiles;
        this.status = status;
        this.cameraPosition = cameraPosition;
    }
}

export {
    GameState2D
}