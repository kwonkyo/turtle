import { GameStatus } from './GameStatus.js';
import { Vector2D } from './Math.js';


interface IGameState {
    status: GameStatus;
}


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
    IGameState,
    Tile2DGameState as Tile2DGameState
}