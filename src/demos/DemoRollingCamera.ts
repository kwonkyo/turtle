import { GameStatus } from '../GameStatus.js';
import { Engine } from '../Engine.js';
import { GameState2D } from '../2d/GameState2D.js';
import { Renderer2D } from '../2d/Renderer2D.js';
import { Vector2D } from '../2d/Vector2D.js';
import { ISimulator } from '../Simulator.js';


const TILES: Record<number, Record<string, string>>= {
    0: {color: '#7FDBFF', name: 'AQUA_SKY'},
    1: {color: '#62B6FF', name: 'BLUE_SKY'},
    2: {color: '#3D9970', name: 'GROUND'}
}

const TILE_SIZE: number = 32;
const MAP_WIDTH_IN_TILES: number = 32;
const MAP_HEIGHT_IN_TILES: number = 10;
const CAMERA_VIEWFIELD_LENGTH: number = 32 * 8;

const MAP: number[] = [
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0,
    0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
];


class RollingCameraSimulator implements ISimulator<GameState2D> {
    constructor(private dxdt: number) {
        this.dxdt = dxdt;
    }

    integrate(state:GameState2D, elapsedTime: number):GameState2D {
        if (state.cameraPosition.x + CAMERA_VIEWFIELD_LENGTH
                > state.widthInTiles * TILE_SIZE) {
            return new GameState2D(
                state.map, state.widthInTiles, state.heightInTiles,
                GameStatus.END, state.cameraPosition);
        }

        let cameraPosition = state.cameraPosition.add(
            new Vector2D(this.dxdt * elapsedTime, 0));

        return new GameState2D(
            state.map, state.widthInTiles, state.heightInTiles,
            state.status, cameraPosition);
    }

    interpolate(state:GameState2D, target:GameState2D, percent: number):GameState2D {
        let cameraPosition = state.cameraPosition.interpolate(
            target.cameraPosition, percent);
        console.log(`Camera Position: ${[cameraPosition.x, cameraPosition.y]}`);
        
        return new GameState2D(
            state.map, state.widthInTiles, state.heightInTiles,
            target.status, cameraPosition);
    }
}


const canvas = document
    .querySelector('canvas')
    .getContext('2d');

const simulator = new RollingCameraSimulator(.1);
const renderer = new Renderer2D(
    canvas, TILES, TILE_SIZE, CAMERA_VIEWFIELD_LENGTH);

const initialCameraPosition = new Vector2D(
    CAMERA_VIEWFIELD_LENGTH, (MAP_HEIGHT_IN_TILES * TILE_SIZE) / 2);
const initialState = new GameState2D(
    MAP, MAP_WIDTH_IN_TILES, MAP_HEIGHT_IN_TILES,
    GameStatus.CONTINUE, initialCameraPosition);
const engine = new Engine(
    1, simulator, renderer, initialState);


window.requestAnimationFrame(() => engine.start());
