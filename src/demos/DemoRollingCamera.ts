import { GameStatus } from '../GameStatus.js';
import { Engine } from '../Engine.js';
import { Tile2DGameState } from '../2d/Tile2DGameState.js';
import { Tile2DRenderer } from '../2d/Tile2DRenderer.js';
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


class RollingCameraSimulator implements ISimulator<Tile2DGameState> {
    constructor(private dxdt: number) {
        this.dxdt = dxdt;
    }

    integrate(state:Tile2DGameState, elapsedTime: number):Tile2DGameState {
        if (state.cameraPosition.x + CAMERA_VIEWFIELD_LENGTH
                > state.widthInTiles * TILE_SIZE) {
            return new Tile2DGameState(
                state.map, state.widthInTiles, state.heightInTiles,
                GameStatus.END, state.cameraPosition);
        }

        let cameraPosition = state.cameraPosition.add(
            new Vector2D(this.dxdt * elapsedTime, 0));

        return new Tile2DGameState(
            state.map, state.widthInTiles, state.heightInTiles,
            state.status, cameraPosition);
    }

    interpolate(state:Tile2DGameState, target:Tile2DGameState, percent: number):Tile2DGameState {
        let cameraPosition = state.cameraPosition.interpolate(
            target.cameraPosition, percent);
        console.log(`Camera Position: ${[cameraPosition.x, cameraPosition.y]}`);
        
        return new Tile2DGameState(
            state.map, state.widthInTiles, state.heightInTiles,
            target.status, cameraPosition);
    }
}


const canvas = document
    .querySelector('canvas')
    .getContext('2d');

const simulator = new RollingCameraSimulator(.1);
const renderer = new Tile2DRenderer(
    canvas, TILES, TILE_SIZE, CAMERA_VIEWFIELD_LENGTH);

const initialCameraPosition = new Vector2D(
    CAMERA_VIEWFIELD_LENGTH, (MAP_HEIGHT_IN_TILES * TILE_SIZE) / 2);
const initialState = new Tile2DGameState(
    MAP, MAP_WIDTH_IN_TILES, MAP_HEIGHT_IN_TILES,
    GameStatus.CONTINUE, initialCameraPosition);
const engine = new Engine(
    1, simulator, renderer, initialState);


window.requestAnimationFrame(() => engine.start());
