import { IGameState } from './GameState.js';


interface ISimulator<T extends IGameState> {
    integrate(state: T, elapsedTime: number) : T;
    interpolate(state: T, target: T, percent: number) : T;
}

export {
    ISimulator
}