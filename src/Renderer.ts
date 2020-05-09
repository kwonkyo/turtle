import { IGameState } from './GameState.js';


interface IRenderer<T extends IGameState> {
    render(state: T): void;
}


export {
    IRenderer
}