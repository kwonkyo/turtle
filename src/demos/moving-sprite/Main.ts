import { GameLoop } from '../../GameLoop.js';
import { Renderer2D } from '../../2d/Renderer2D.js';
import { Vector2D, KeyPressControlledVector2D } from '../../2d/Vector2D.js';
import { Camera2D, KeyPressControlledCameraPosition2D } from '../../2d/Camera2D.js';
import { EventControlHub } from '../../ControlHub.js';
import { KeyPressController } from '../../Controller.js';
import { FrameRenderable2D } from '../../2d/Renderable2D.js';
import { Map2D } from '../../2d/Map2D.js';
import { RenderRequestPool2D } from '../../2d/RenderRequestPool2D.js';
import { RenderRequest2D } from '../../2d/RenderRequest2D.js';
import { 
    GOLEM_INITIAL_POSITION, GOLEM_ACCELERATION, CAMERA_INITIAL_POSITION,
    CAMERA_WIDTH, CAMERA_HEIGHT, CAMERA_SPEED,
    UNIT_LENGTH, MAP_ROWS, MAP_COLUMNS, MAP, BRICKS,
    GOLEM_DISPLAY_WIDTH, GOLEM_DISPLAY_HEIGHT, INITIAL_STATE } from './Constants.js';
import { Golem } from './Golem.js';
import { GolemAnimation } from './GolemAnimation.js';
import { CameraMovementSimulator } from './CameraMovementSimulator.js';
import { GolemPhysicsSimulator } from './GolemPhysicsSimulator.js';
import { UniverseSimulator } from './UniverseSimulator.js';


const canvas = document
    .querySelector('canvas')
    .getContext('2d');

const golem = new Golem(GOLEM_INITIAL_POSITION, new Vector2D(0, 0));
const golemVelocity = new KeyPressControlledVector2D(
    GOLEM_ACCELERATION, golem.velocity);
const golemAnimation = new GolemAnimation();

const camera = new Camera2D(
    CAMERA_INITIAL_POSITION, CAMERA_WIDTH, CAMERA_HEIGHT);
const cameraPosition = new KeyPressControlledCameraPosition2D(
    camera, CAMERA_SPEED, UNIT_LENGTH, MAP_ROWS, MAP_COLUMNS);

const controlHub = new EventControlHub(
    [
        cameraPosition,
        golemVelocity
    ],
    [
        KeyPressController.LEFT_ARROW,
        KeyPressController.UP_ARROW,
        KeyPressController.RIGHT_ARROW,
        KeyPressController.DOWN_ARROW
    ]
);

const pool = new RenderRequestPool2D();
pool.add(new RenderRequest2D(
    new Map2D(MAP, BRICKS, MAP_COLUMNS, UNIT_LENGTH, camera),
    new Vector2D(0, 0), 0));
pool.add(new RenderRequest2D(
    new FrameRenderable2D(
        golemAnimation, GOLEM_DISPLAY_WIDTH, GOLEM_DISPLAY_HEIGHT),
    golem.position, 1));
const renderer = new Renderer2D(canvas, camera, pool);

const simulator = new UniverseSimulator([
    new GolemPhysicsSimulator(golem, golemAnimation),
    new CameraMovementSimulator(camera, golem, UNIT_LENGTH, MAP_ROWS, MAP_COLUMNS)
]);

const gameLoop = new GameLoop(
    60 / 1000, simulator, renderer, INITIAL_STATE);


window.addEventListener('keydown', e => controlHub.receive(e));
window.addEventListener('keyup', e => controlHub.receive(e));
window.requestAnimationFrame(() => gameLoop.run());
