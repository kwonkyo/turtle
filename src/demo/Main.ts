import { GameLoop } from '../GameLoop.js';
import { Renderer2D } from '../2d/Renderer2D.js';
import { Vector2D } from '../2d/Vector2D.js';
import { Camera2D } from '../2d/Camera2D.js';
import { EventControlHub } from '../ControlHub.js';
import { FrameRenderable2D } from '../2d/Renderable2D.js';
import { RenderRequestPool2D } from '../2d/RenderRequestPool2D.js';
import { RenderRequest2D } from '../2d/RenderRequest2D.js';
import { Map } from './Map.js';
import { 
    GOLEM_INITIAL_POSITION, GOLEM_ACCELERATION, CAMERA_INITIAL_POSITION,
    CAMERA_WIDTH, CAMERA_HEIGHT, UNIT_LENGTH, MAP_ROWS, MAP_COLUMNS,
    GOLEM_DISPLAY_WIDTH, GOLEM_DISPLAY_HEIGHT, INITIAL_STATE, MAP } from './Constants.js';
import { Golem } from './Golem.js';
import { GolemFrame } from './GolemFrame.js';
import { CameraMovementSimulator } from './CameraMovementSimulator.js';
import { GolemPhysicsSimulator } from './GolemPhysicsSimulator.js';
import { UniverseSimulator } from './UniverseSimulator.js';
import { KeyPressController } from '../Controller.js';
import { KeyPressControlledGolem } from './KeyPressControlledGolem.js';
import { CollisionSimulator } from './CollisionSimulator.js';
import { Animator } from '../Animator.js';


const canvas = document
    .querySelector('canvas')
    .getContext('2d');

const golem = new Golem(GOLEM_INITIAL_POSITION, new Vector2D(0, 0));

const camera = new Camera2D(
    CAMERA_INITIAL_POSITION, CAMERA_WIDTH, CAMERA_HEIGHT);

const animator = new Animator();
const golemFrame = new GolemFrame();
const pool = new RenderRequestPool2D();
pool.add(new RenderRequest2D(
    new Map(MAP, camera), new Vector2D(0, 0), 0));
pool.add(new RenderRequest2D(
    new FrameRenderable2D(
        golemFrame, GOLEM_DISPLAY_WIDTH, GOLEM_DISPLAY_HEIGHT),
    golem.position, 1));
const renderer = new Renderer2D(
    canvas, camera, pool, () => animator.animate(golem, golemFrame));

const simulator = new UniverseSimulator([
    new GolemPhysicsSimulator(golem),
    new CollisionSimulator(golem, MAP),
    new CameraMovementSimulator(camera, golem, UNIT_LENGTH, MAP_ROWS, MAP_COLUMNS)
]);

const gameLoop = new GameLoop(
    60 / 1000, simulator, renderer, INITIAL_STATE);

const controlHub = new EventControlHub(
    [
        new KeyPressControlledGolem(golem, GOLEM_ACCELERATION)
    ],
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
