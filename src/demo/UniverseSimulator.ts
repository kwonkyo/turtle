import { ISimulator } from "../Simulator.js";
import { GameState2D } from "../2d/GameState2D.js";


class UniverseSimulator implements ISimulator<GameState2D> {
    constructor(
            private simulators: ISimulator<GameState2D>[]) {
        this.simulators = simulators;
    }
    integrate(state: GameState2D, elapsedTime: number): GameState2D {
        for (let simulator of this.simulators) {
            state = simulator.integrate(state, elapsedTime);
        }

        return state;
    }

    interpolate = (state: GameState2D, target: GameState2D, percent: number) : GameState2D => state;
}


export {
    UniverseSimulator
}