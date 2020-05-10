import { GameStatus } from '../GameStatus.js';
import { Engine } from '../Engine.js';
import { GameState2D } from '../2d/GameState2D.js';
import { Renderer2D, Rectangle } from '../2d/Renderer2D.js';
import { Vector2D } from '../2d/Vector2D.js';
import { ISimulator } from '../Simulator.js';
import { Camera2D, Camera2DTranslation } from '../2d/Camera2D.js';
import { EventController } from '../Controller.js';
import { KeyPressControls } from '../Controls.js';


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
const cameraTranslation = new Camera2DTranslation(
    camera, CAMERA_SPEED, INITIAL_STATE, UNIT_LENGTH);

const renderer = new Renderer2D(
    canvas, camera, RENDERABLES, UNIT_LENGTH);

const simulator = new NoSimulator();
const engine = new Engine(
    60 / 1000, simulator, renderer, INITIAL_STATE);

const controller = new EventController(
    [cameraTranslation],
    [
        KeyPressControls.LEFT,
        KeyPressControls.UP,
        KeyPressControls.RIGHT,
        KeyPressControls.DOWN
    ]
);
window.addEventListener('keydown', e => controller.control(e));
window.addEventListener('keyup', e => controller.control(e));
window.requestAnimationFrame(() => engine.start());
