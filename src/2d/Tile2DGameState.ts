import { IGameState } from '../GameState.js';
import { GameStatus } from '../GameStatus.js';
import { Vector2D } from './Vector2D.js';


class Tile2DGameState implements IGameState {
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
    Tile2DGameState
}