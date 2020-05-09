import { IGameState } from '../GameState.js';
import { GameStatus } from '../GameStatus.js';


class GameState2D implements IGameState {
    constructor(
            public map: number[],
            public width: number,
            public height: number,
            public status: GameStatus) {
        this.map = map;
        this.width = width;
        this.height = height;
        this.status = status;
    }
}

export {
    GameState2D
}