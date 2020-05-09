import { IGameState } from './GameState.js';


interface ISimulator<T extends IGameState> {
    integrate(state: T, elapsedTime: number): T;
    interpolate(state: T, target: T, percent: number) : T;
}


function linearInterpolate(start: number, end: number, percent: number) {
    return start * (1 - percent) + end * percent
}

export {
    ISimulator,
    linearInterpolate
}