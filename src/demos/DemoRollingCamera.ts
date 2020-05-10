import { GameStatus } from '../GameStatus.js';
import { GameLoop } from '../GameLoop.js';
import { GameState2D } from '../2d/GameState2D.js';
import { Renderer2D } from '../2d/Renderer2D.js';
import { Vector2D } from '../2d/Vector2D.js';
import { ISimulator } from '../Simulator.js';
import { Camera2D } from '../2d/Camera2D.js';
import { Rectangle } from '../2d/Renderable2D.js';


const MAP_WIDTH: number = 32;
const MAP_HEIGHT: number = 10;
const UNIT_LENGTH: number = 64;
const CAMERA_WIDTH: number = UNIT_LENGTH * 10;
const CAMERA_HEIGHT: number = UNIT_LENGTH * 10;

const RENDERABLES: Record<number, Rectangle>= {
    0: new Rectangle('AQUA_SKY', '#7FDBFF', UNIT_LENGTH, UNIT_LENGTH),
    1: new Rectangle('BLUE_SKY', '#62B6FF', UNIT_LENGTH, UNIT_LENGTH),
    2: new Rectangle('GROUND', '#3D9970', UNIT_LENGTH, UNIT_LENGTH)
};

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

const INITIAL_STATE: GameState2D = new GameState2D(
    MAP, MAP_WIDTH, MAP_HEIGHT, GameStatus.CONTINUE);


class RollingCameraSimulator implements ISimulator<GameState2D> {
    constructor(
            private camera: Camera2D,
            private dxdt: number) {
        this.dxdt = dxdt;
    }

    integrate(state: GameState2D, elapsedTime: number) : GameState2D {
        if (this.camera.position.x + camera.width > state.width * UNIT_LENGTH) {
            return new GameState2D(
                state.map, state.width, state.height, GameStatus.END);
        }

        this.camera.setPosition(
            this.camera.position.add(
                new Vector2D(this.dxdt * elapsedTime, 0)));

        return state;
    }

    interpolate = (state: GameState2D, target: GameState2D, percent: number) : GameState2D => state;
}


const canvas = document
    .querySelector('canvas')
    .getContext('2d');

const camera = new Camera2D(
    new Vector2D(0, 0), CAMERA_WIDTH, CAMERA_HEIGHT);
const renderer = new Renderer2D(
    canvas, camera, RENDERABLES, UNIT_LENGTH);

const simulator = new RollingCameraSimulator(camera, .1);
const gameLoop = new GameLoop(
    60 / 1000, simulator, renderer, INITIAL_STATE);


window.requestAnimationFrame(() => gameLoop.run());
