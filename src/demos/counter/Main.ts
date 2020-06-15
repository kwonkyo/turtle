import { GameLoop } from '../../GameLoop.js';
import { IGameState } from '../../GameState.js';
import { GameStatus } from '../../GameStatus.js';
import { ISimulator } from '../../Simulator.js';
import { linearInterpolate } from '../../Math.js';
import { IRenderer } from '../../Renderer.js';


class DemoGameState implements IGameState {
    counter: number;
    end: number;
    status: GameStatus;

    constructor(
            counter: number=0, end: number=100,
            status: GameStatus=GameStatus.CONTINUE) {
        this.counter = counter;
        this.end = end;
        this.status = status;
    }
}


class DemoSimulator implements ISimulator<DemoGameState> {
    rate: number;
    accumulatedTime: number;

    constructor(rate: number) {
        this.rate = rate;
        this.accumulatedTime = 0.;
    }

    integrate(state: DemoGameState, elapsedTime: number): DemoGameState {
        let counter = state.counter;
        let status = state.status;

        if (this.accumulatedTime >= 1. / this.rate) {
            counter++;

            this.accumulatedTime = 0;
        } else{
            this.accumulatedTime += elapsedTime;
        }

        if (counter >= state.end) {
            status = GameStatus.END;
        }

        return new DemoGameState(counter, state.end, status);
    }

    interpolate(
            state: DemoGameState, target: DemoGameState, percent: number)
            : DemoGameState {
        return new DemoGameState(
            linearInterpolate(state.counter, target.counter, percent),
            state.end,
            state.status);
    }
}


class DemoRenderer implements IRenderer<DemoGameState> {
    render(state: DemoGameState) {
        console.log(state.counter);
    }
}


const FRAME_RATE = 30. / 1000;  // 30 FPS
const MAX_ACCUMULATED_FRAMES = 5;

const gameLoop = new GameLoop(
    FRAME_RATE,
    new DemoSimulator(1 / 1000.),  // 1 FPS
    new DemoRenderer(),
    new DemoGameState(0, 100),
    MAX_ACCUMULATED_FRAMES
);

window.requestAnimationFrame(() => gameLoop.run());
