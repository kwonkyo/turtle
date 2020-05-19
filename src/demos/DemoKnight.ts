import { GameStatus } from '../GameStatus.js';
import { GameLoop } from '../GameLoop.js';
import { GameState2D } from '../2d/GameState2D.js';
import { Renderer2D } from '../2d/Renderer2D.js';
import { Vector2D } from '../2d/Vector2D.js';
import { ISimulator } from '../Simulator.js';
import { Camera2D, Camera2DPosition } from '../2d/Camera2D.js';
import { EventControlHub } from '../ControlHub.js';
import { KeyPressController } from '../Controller.js';
import { Rectangle, IRenderable2D, ImageRenderable } from '../2d/Renderable2D.js';
import { Map2D } from '../2d/Map2D.js';
import { RenderRequestPool2D } from '../2d/RenderRequestPool2D.js';
import { RenderRequest2D } from '../2d/RenderRequest2D.js';


const MAP_ROWS: number = 17;
const MAP_COLUMNS: number = 32;
const UNIT_LENGTH: number = 64;
const CAMERA_WIDTH: number = UNIT_LENGTH * 10;
const CAMERA_HEIGHT: number = UNIT_LENGTH * 10;
const CAMERA_INITIAL_POSITION: Vector2D = new Vector2D(
    0, UNIT_LENGTH * MAP_ROWS - CAMERA_HEIGHT);
const CAMERA_SPEED: number = 8;

const BRICKS: Record<number, IRenderable2D>= {
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
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0,
    0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 1, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
];

const INITIAL_STATE: GameState2D = new GameState2D(GameStatus.CONTINUE);

const KNIGHT_WIDTH: number = 2.5 * UNIT_LENGTH;
const KNIGHT_HEIGHT: number = 2.5 * UNIT_LENGTH;
const KNIGHT_INITIAL_POSITION: Vector2D = new Vector2D(
    3 * UNIT_LENGTH, 14 * UNIT_LENGTH - KNIGHT_HEIGHT);


class NoSimulator implements ISimulator<GameState2D> {
    integrate = (state: GameState2D, elapsedTime: number) : GameState2D => state;
    interpolate = (state: GameState2D, target: GameState2D, percent: number) : GameState2D => state;
}


const canvas = document
    .querySelector('canvas')
    .getContext('2d');

const camera = new Camera2D(
    CAMERA_INITIAL_POSITION, CAMERA_WIDTH, CAMERA_HEIGHT);
const cameraPosition = new Camera2DPosition(
    camera, CAMERA_SPEED, UNIT_LENGTH, MAP_ROWS, MAP_COLUMNS);

const pool = new RenderRequestPool2D();
pool.add(new RenderRequest2D(
    new Map2D(MAP, BRICKS, MAP_COLUMNS, UNIT_LENGTH, camera),
    new Vector2D(0, 0), 0));
pool.add(new RenderRequest2D(
    new ImageRenderable('assets/knight.png', KNIGHT_WIDTH, KNIGHT_HEIGHT),
    KNIGHT_INITIAL_POSITION, 1));

const renderer = new Renderer2D(canvas, camera, pool);

const simulator = new NoSimulator();
const gameLoop = new GameLoop(
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
window.requestAnimationFrame(() => gameLoop.run());
