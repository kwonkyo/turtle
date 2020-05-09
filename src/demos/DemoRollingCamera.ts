import { GameState } from '../GameState.js';
import { Renderer } from '../Renderer.js';
import { GameStatus } from '../GameStatus.js';
import { Engine } from '../Engine.js';
import { Vector2D } from '../Math.js';
import { ISimulator, linearInterpolate } from '../Simulator.js';
import {
    TILES, TILE_SIZE, MAP_WIDTH_IN_TILES,
    CAMERA_VIEWFIELD_LENGTH, MAP_HEIGHT_IN_TILES, MAP} from './Constants.js';


class RollingCameraSimulator implements ISimulator<GameState> {
    constructor(private dxdt: number) {
        this.dxdt = dxdt;
    }

    integrate(state: GameState, elapsedTime: number): GameState {
        if (state.cameraPosition.x + CAMERA_VIEWFIELD_LENGTH
                > state.widthInTiles * TILE_SIZE) {
            return new GameState(
                state.map, state.widthInTiles, state.heightInTiles,
                GameStatus.END, state.cameraPosition);
        }

        let cameraPosition = state.cameraPosition.add(
            new Vector2D(this.dxdt * elapsedTime, 0));

        return new GameState(
            state.map, state.widthInTiles, state.heightInTiles,
            state.status, cameraPosition);
    }

    interpolate(state: GameState, target: GameState, percent: number): GameState {
        let cameraPosition = new Vector2D(
            linearInterpolate(
                state.cameraPosition.x, target.cameraPosition.x, percent),
            linearInterpolate(
                state.cameraPosition.y, target.cameraPosition.y, percent)
        );
        console.log(`Camera Position: ${[cameraPosition.x, cameraPosition.y]}`);
        
        return new GameState(
            state.map, state.widthInTiles, state.heightInTiles,
            target.status, cameraPosition);
    }
}

const canvas = document
    .querySelector('canvas')
    .getContext('2d');

const simulator = new RollingCameraSimulator(.1);
const renderer = new Renderer(
    canvas, TILES, TILE_SIZE, CAMERA_VIEWFIELD_LENGTH);

const initialCameraPosition = new Vector2D(
    CAMERA_VIEWFIELD_LENGTH, (MAP_HEIGHT_IN_TILES * TILE_SIZE) / 2);
const initialState = new GameState(
    MAP, MAP_WIDTH_IN_TILES, MAP_HEIGHT_IN_TILES,
    GameStatus.CONTINUE, initialCameraPosition);
const engine = new Engine(
    1, simulator, renderer, initialState);

window.requestAnimationFrame(() => engine.start());
