import { GameStatus } from '../GameStatus.js';
import { Engine } from '../Engine.js';
import { GameState2D } from '../2d/GameState2D.js';
import { Renderer2D } from '../2d/Renderer2D.js';
import { Vector2D } from '../2d/Vector2D.js';
import { ISimulator } from '../Simulator.js';
import { Camera2D } from '../2d/Camera2D.js';


const TILES: Record<number, Record<string, string>>= {
    0: {color: '#7FDBFF', name: 'AQUA_SKY'},
    1: {color: '#62B6FF', name: 'BLUE_SKY'},
    2: {color: '#3D9970', name: 'GROUND'}
}

const TILE_SIZE: number = 32;
const MAP_WIDTH: number = 32;
const MAP_HEIGHT: number = 10;
const CAMERA_WIDTH: number = TILE_SIZE * 10;
const CAMERA_HEIGHT: number = TILE_SIZE * 10;

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
    constructor(
            private camera: Camera2D,
            private dxdt: number) {
        this.dxdt = dxdt;
    }

    integrate(state: GameState2D, elapsedTime: number):GameState2D {
        if (this.camera.position.x + camera.width > state.width * TILE_SIZE) {
            return new GameState2D(
                state.map, state.width, state.height, GameStatus.END);
        }

        this.camera.setPosition(
            this.camera.position.add(
                new Vector2D(this.dxdt * elapsedTime, 0)));

        return state;
    }

    interpolate(state: GameState2D, target: GameState2D, percent: number):GameState2D {
        return state;
    }
}


const canvas = document
    .querySelector('canvas')
    .getContext('2d');

const camera = new Camera2D(
    new Vector2D(0, 0), CAMERA_WIDTH, CAMERA_HEIGHT);
const simulator = new RollingCameraSimulator(camera, .1);
const renderer = new Renderer2D(
    canvas, camera, TILES, TILE_SIZE);

const initialState = new GameState2D(
    MAP, MAP_WIDTH, MAP_HEIGHT, GameStatus.CONTINUE);
const engine = new Engine(
    1, simulator, renderer, initialState);


window.requestAnimationFrame(() => engine.start());
