import { Vector2D } from "./Vector2D";
import { IControllable } from "../Controllable.js";
import { KeyPressControlState, KEYCODE } from "../ControlState.js";
import { ControlType } from "../ControlType.js";
import { GameState2D } from "./GameState2D";

interface ICamera2D {
    position: Vector2D;
    width: number;
    height: number;

    setPosition(position: Vector2D);
    setWidth(width: number);
    setHeight(height: number);
    inField(point: Vector2D) : boolean;
    getCameraFrameCoordinates(point: Vector2D) : Vector2D;
}


class Camera2D implements ICamera2D {
    constructor(
            public position: Vector2D,
            public width: number,
            public height: number) {
        this.position = position;
        this.width = width;
        this.height = height;
    }

    setPosition(position: Vector2D) {
        this.position = position;
    }

    setWidth(width: number) {
        this.width = width;
    }

    setHeight(height: number) {
        this.height = height;
    }

    inField(point: Vector2D): boolean {
        return (
            point.x >= this.position.x && point.x <= this.position.x + this.width &&
            point.y >= this.position.y && point.y <= this.position.y + this.height
        )
    }

    getCameraFrameCoordinates(point: Vector2D): Vector2D {
        return point.subtract(this.position);
    }
}


class Camera2DTranslation implements IControllable<KeyPressControlState> {
    controlType: ControlType = ControlType.KEYPRESS;

    constructor(
            private camera: Camera2D,
            private speed: number,
            private state: GameState2D,
            private unitLength: number) {
        this.camera = camera;
        this.speed = speed;
        this.state = state;
        this.unitLength = unitLength;
    }

    receive(controlState: KeyPressControlState): void {
        if (controlState.keyCode === KEYCODE.LEFT) {
            this.camera.position.x -= this.speed;
        } else if (controlState.keyCode === KEYCODE.UP) {
            this.camera.position.y -= this.speed;
        } else if (controlState.keyCode === KEYCODE.RIGHT) {
            this.camera.position.x += this.speed;
        } else if (controlState.keyCode === KEYCODE.DOWN) {
            this.camera.position.y += this.speed;
        }

        this.camera.position.x = Math.min(
            Math.max(0, this.camera.position.x),
            this.state.width * this.unitLength
        );

        this.camera.position.y = Math.min(
            Math.max(0, this.camera.position.y),
            this.state.height * this.unitLength - this.camera.height
        );
    }
}


export {
    Camera2D,
    Camera2DTranslation
}