import { GameStatus } from '../GameStatus.js';
import { Engine } from '../Engine.js';
import { GameState2D } from '../2d/GameState2D.js';
import { Renderer2D } from '../2d/Renderer2D.js';
import { Vector2D } from '../2d/Vector2D.js';
import { ISimulator } from '../Simulator.js';
import { Camera2D, Camera2DPosition } from '../2d/Camera2D.js';
import { EventControlHub } from '../ControlHub.js';
import { KeyPressController } from '../Controller.js';
import { Rectangle } from '../2d/Renderable2D.js';


const MAP_WIDTH: number = 32;
const MAP_HEIGHT: number = 10;
const UNIT_LENGTH: number = 64;
const CAMERA_WIDTH: number = UNIT_LENGTH * 8;
const CAMERA_HEIGHT: number = UNIT_LENGTH * 8;
const CAMERA_SPEED: number = 5;

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


class NoSimulator implements ISimulator<GameState2D> {
    integrate = (state: GameState2D, elapsedTime: number) : GameState2D => state;
    interpolate = (state: GameState2D, target: GameState2D, percent: number) : GameState2D => state;
}


const canvas = document
    .querySelector('canvas')
    .getContext('2d');

const camera = new Camera2D(
    new Vector2D(0, 0), CAMERA_WIDTH, CAMERA_HEIGHT);
const cameraPosition = new Camera2DPosition(
    camera, CAMERA_SPEED, INITIAL_STATE, UNIT_LENGTH);

const renderer = new Renderer2D(
    canvas, camera, RENDERABLES, UNIT_LENGTH);

const simulator = new NoSimulator();
const engine = new Engine(
    60 / 1000, simulator, renderer, INITIAL_STATE);

const controlHub = new EventControlHub(
    [cameraPosition],
    [
        KeyPressController.LEFT_ARROW,
        KeyPressController.UP_ARROW,
        KeyPressController.RIGHT_ARROW,
        KeyPressController.DOWN_ARROW
    ]
);
window.addEventListener('keydown', e => controlHub.receive(e));
window.addEventListener('keyup', e => controlHub.receive(e));
window.requestAnimationFrame(() => engine.start());
