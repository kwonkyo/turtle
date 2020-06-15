import { GameStatus } from '../../GameStatus.js';
import { GameLoop } from '../../GameLoop.js';
import { GameState2D } from '../../2d/GameState2D.js';
import { Renderer2D } from '../../2d/Renderer2D.js';
import { Vector2D, KeyPressControlledVector2D } from '../../2d/Vector2D.js';
import { ISimulator } from '../../Simulator.js';
import { Camera2D, KeyPressControlledCameraPosition2D } from '../../2d/Camera2D.js';
import { EventControlHub } from '../../ControlHub.js';
import { KeyPressController } from '../../Controller.js';
import { Rectangle, IRenderable2D, FrameRenderable2D } from '../../2d/Renderable2D.js';
import { Map2D } from '../../2d/Map2D.js';
import { RenderRequestPool2D } from '../../2d/RenderRequestPool2D.js';
import { RenderRequest2D } from '../../2d/RenderRequest2D.js';
import { Frame2D, FrameAnimation2D } from '../../2d/Frame2D.js';
import { Animator, IAnimator } from '../../Animator.js';
import { IAnimatable } from '../../Animatable.js';
import { IModel } from '../../Model.js';
import { linearInterpolate } from '../../Math.js';


const MAP_ROWS: number = 17;
const MAP_COLUMNS: number = 32;
const UNIT_LENGTH: number = 64;
const CAMERA_WIDTH: number = UNIT_LENGTH * 10;
const CAMERA_HEIGHT: number = UNIT_LENGTH * 10;
const CAMERA_INITIAL_POSITION: Vector2D = new Vector2D(
    0, UNIT_LENGTH * MAP_ROWS - CAMERA_HEIGHT);
const CAMERA_SPEED: number = 2;

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

const SPRITE_WIDTH: number = 2.5 * UNIT_LENGTH;
const SPRITE_HEIGHT: number = 2 * UNIT_LENGTH;
const SPRITE_POSITION: Vector2D = new Vector2D(
    3 * UNIT_LENGTH, 12 * UNIT_LENGTH);
const SPRITE_ACCELERATION: Vector2D = new Vector2D(1.8, 1.8);
const SPRITE_MIN_SPEED: number = 0.1;

const FRICTION: number = 2;


class GolemAnimationState implements IAnimationState {
    constructor(public name: string) {
        this.name = name;
    }

    static IDLE = new GolemAnimationState('idle');
    static WALKING = new GolemAnimationState('walking');
}

class Golem implements IModel, IAnimatable {
    constructor(
            public position: Vector2D,
            public velocity: Vector2D) {
        this.position = position;
        this.velocity = velocity;
    }

    getAnimationState(): IAnimationState {
        if (this.velocity.x === 0 && this.velocity.y === 0) {
            return GolemAnimationState.IDLE;
        } else if (this.velocity.y === 0) {
            return GolemAnimationState.WALKING;
        } else {
            return GolemAnimationState.IDLE;
        }
    }
}

class GolemAnimation extends FrameAnimation2D {
    static FRAMES : Record<string, Frame2D[]> = {
        "idle": [...Array(11).keys()]
            .map(x => String(x).padStart(3, '0'))
            .map(x => `assets/Golem_01/Idle/Golem_01_Idle_${x}.png`)
            .map(x => new Frame2D(x)),
        "walking": [...Array(17).keys()]
            .map(x => String(x).padStart(3, '0'))
            .map(x => `assets/Golem_01/Walking/Golem_01_Walking_${x}.png`)
            .map(x => new Frame2D(x))
    }

    constructor() {
        super(GolemAnimation.FRAMES, 30 / 1000, GolemAnimationState.IDLE);
    }
}


const golem = new Golem(SPRITE_POSITION, new Vector2D(0, 0));
const golemVelocity = new KeyPressControlledVector2D(
    SPRITE_ACCELERATION, golem.velocity);
const golemAnimation = new GolemAnimation();

class GolemSimulator implements ISimulator<GameState2D> {
    constructor(
            private animator: IAnimator<Golem, GolemAnimation>) {
        this.animator = animator;
    }

    integrate(state: GameState2D, elapsedTime: number) : GameState2D {
        this.animator.animate(golem, golemAnimation);

        golem.position.x += golem.velocity.x;
        golem.position.y += golem.velocity.y;

        golem.velocity.x /= FRICTION;
        if (golem.velocity.x < SPRITE_MIN_SPEED) {
            golem.velocity.x = 0.;
        }

        golem.velocity.y /= FRICTION;
        if (golem.velocity.y < SPRITE_MIN_SPEED) {
            golem.velocity.y = 0.;
        }

        return state;
    }

    interpolate = (state: GameState2D, target: GameState2D, percent: number) : GameState2D => state;
}


const canvas = document
    .querySelector('canvas')
    .getContext('2d');

const camera = new Camera2D(
    CAMERA_INITIAL_POSITION, CAMERA_WIDTH, CAMERA_HEIGHT);
const cameraPosition = new KeyPressControlledCameraPosition2D(
    camera, CAMERA_SPEED, UNIT_LENGTH, MAP_ROWS, MAP_COLUMNS);

class CameraSimulator implements ISimulator<GameState2D> {
    integrate(state: GameState2D, elapsedTime: number): GameState2D {
        if (golem.getAnimationState() == GolemAnimationState.IDLE) {
            camera.position.x = linearInterpolate(camera.position.x, golem.position.x, 0.01);
        }

        return state;
    }

    interpolate = (state: GameState2D, target: GameState2D, percent: number) : GameState2D => state;
}

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
        golemAnimation, SPRITE_WIDTH, SPRITE_HEIGHT),
    golem.position, 1));

const renderer = new Renderer2D(canvas, camera, pool);

const animator = new Animator();
const cameraSimulator = new CameraSimulator();
const golemSimulator = new GolemSimulator(animator);

class WorldSimulator implements ISimulator<GameState2D> {
    integrate(state: GameState2D, elapsedTime: number): GameState2D {
        golemSimulator.integrate(state, elapsedTime);
        cameraSimulator.integrate(state, elapsedTime);

        return state;
    }

    interpolate = (state: GameState2D, target: GameState2D, percent: number) : GameState2D => state;
}

const simulator = new WorldSimulator();
const gameLoop = new GameLoop(
    60 / 1000, simulator, renderer, INITIAL_STATE);


window.addEventListener('keydown', e => controlHub.receive(e));
window.addEventListener('keyup', e => controlHub.receive(e));
window.requestAnimationFrame(() => gameLoop.run());
