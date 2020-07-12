import { GameLoop } from '../GameLoop.js';
import { Renderer2D } from '../2d/Renderer2D.js';
import { Vector2D } from '../2d/Vector2D.js';
import { Camera2D } from '../2d/Camera2D.js';
import { EventControlHub } from '../ControlHub.js';
import { FrameRenderable2D } from '../2d/Renderable2D.js';
import { RenderRequestPool2D } from '../2d/RenderRequestPool2D.js';
import { RenderRequest2D } from '../2d/RenderRequest2D.js';
import { World } from './World.js';
import { 
    CHARACTER_INITIAL_POSITION, CHARACTER_ACCELERATION, CAMERA_INITIAL_POSITION,
    CAMERA_WIDTH, CAMERA_HEIGHT, UNIT_LENGTH, MAP_ROWS, MAP_COLUMNS,
    CHARACTER_DISPLAY_WIDTH, CHARACTER_DISPLAY_HEIGHT, INITIAL_STATE, MAP } from './Constants.js';
import { Character } from './Character.js';
import { CharacterFrame } from './CharacterFrame.js';
import { CameraMovementSimulator } from './CameraMovementSimulator.js';
import { CharacterPhysicsSimulator } from './CharacterPhysicsSimulator.js';
import { UniverseSimulator } from './UniverseSimulator.js';
import { KeyPressController } from '../Controller.js';
import { CharacterMotion } from './CharacterMotion.js';
import { CollisionSimulator } from './CollisionSimulator.js';
import { Animator } from '../Animator.js';


const canvas = document
    .querySelector('canvas')
    .getContext('2d');

const character = new Character(CHARACTER_INITIAL_POSITION, new Vector2D(0, 0));

const camera = new Camera2D(
    CAMERA_INITIAL_POSITION, CAMERA_WIDTH, CAMERA_HEIGHT);
const world = new World(MAP, camera);

const animator = new Animator();
const characterFrame = new CharacterFrame();
const pool = new RenderRequestPool2D();
pool.add(new RenderRequest2D(
    world, new Vector2D(0, 0), 0));
pool.add(new RenderRequest2D(
    new FrameRenderable2D(
        characterFrame, CHARACTER_DISPLAY_WIDTH, CHARACTER_DISPLAY_HEIGHT),
    character.position, 1));
const renderer = new Renderer2D(
    canvas, camera, pool, () => animator.animate(character, characterFrame));

const simulator = new UniverseSimulator([
    new CharacterPhysicsSimulator(character, world),
    new CollisionSimulator(character, MAP),
    new CameraMovementSimulator(camera, character, UNIT_LENGTH, MAP_ROWS, MAP_COLUMNS)
]);

const gameLoop = new GameLoop(
    60 / 1000, simulator, renderer, INITIAL_STATE);

const controlHub = new EventControlHub(
    [
        new CharacterMotion(character, CHARACTER_ACCELERATION)
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
