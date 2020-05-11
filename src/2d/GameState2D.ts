import { IGameState } from '../GameState.js';
import { GameStatus } from '../GameStatus.js';


class GameState2D implements IGameState {
    constructor(
            public status: GameStatus) {
        this.status = status;
    }
}

export {
    GameState2D
}