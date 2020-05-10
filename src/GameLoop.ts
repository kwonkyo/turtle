import { GameStatus } from './GameStatus.js';
import { IGameState } from './GameState.js';
import { ISimulator } from './Simulator.js';
import { IRenderer } from './Renderer.js';


interface IGameLoop {
    run() : void;
}

class GameLoop<T extends IGameState> implements IGameLoop {
    private framePeriod: number;
    private state: T;
    private targetState: T;
    private renderState: T;
    private realCurrentTime: number;
    private elapsedTime: number;
    private accumulatedTime: number;

    constructor(
            frameRate: number,
            private simulator: ISimulator<T>,
            private renderer: IRenderer<T>,
            private initialState: T,
            private maxAccumulatedFrames: number=5) {
        this.framePeriod = 1. / frameRate;
        this.simulator = simulator;
        this.renderer = renderer;
        this.initialState = initialState;
        this.maxAccumulatedFrames = maxAccumulatedFrames;
    }

    run() : void {
        this.state = this.initialState;
        this.targetState = this.state;
        this.renderState = this.state;

        this.realCurrentTime = Date.now();
        this.elapsedTime = 0;  // Elapsed time since last loop iteration
        this.accumulatedTime = 0;  // Elapsed time since last frame

        window.requestAnimationFrame(() => this.runSingleLoop());
    }

    private runSingleLoop() : void {
        if (this.state.status === GameStatus.END) {
            return;
        }

        this.elapsedTime = Date.now() - this.realCurrentTime;
        this.realCurrentTime += this.elapsedTime;
        this.accumulatedTime += this.elapsedTime;

        while (this.accumulatedTime >= this.framePeriod) {
            // Clamp accumulated time to avoid "spiral of death", where
            // integration is computationally expensive and takes longer than
            // the current elapsed time.
            this.accumulatedTime = Math.min(
                this.accumulatedTime, this.maxAccumulatedFrames * this.framePeriod);

            this.state = this.targetState;
            this.targetState = this.simulator.integrate(this.state, this.framePeriod);

            this.accumulatedTime -= this.framePeriod;
        }

        this.renderState = this.simulator.interpolate(
            this.state, this.targetState, this.accumulatedTime / this.framePeriod);

        this.renderer.render(this.renderState);
        
        window.requestAnimationFrame(() => this.runSingleLoop());
    }
}


export {
    IGameLoop,
    GameLoop
}