import { Vector2D, KeyPressControlledVector2D } from "./Vector2D.js";
import { KeyPressControlState, KEYCODE } from "../ControlState.js";
import { ControlType } from "../ControlType.js";

interface ICamera2D {
    position: Vector2D;
    width: number;
    height: number;

    setPosition(position: Vector2D) : void;
    setWidth(width: number) : void;
    setHeight(height: number) : void;
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

    setPosition(position: Vector2D) : void {
        this.position = position;
    }

    setWidth(width: number) : void {
        this.width = width;
    }

    setHeight(height: number) : void {
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


class KeyPressControlledCameraPosition2D extends KeyPressControlledVector2D {
    type: ControlType = ControlType.KEYPRESS;

    constructor(
            private camera: Camera2D,
            speed: number,
            private unitLength: number,
            private mapRows: number,
            private mapColumns: number) {
        super(new Vector2D(1, 1).scale(speed), camera.position);

        this.unitLength = unitLength;
        this.mapRows = mapRows;
        this.mapColumns = mapColumns;
    }

    obey(controlState: KeyPressControlState) : void {
        super.obey(controlState);

        this.camera.position.x = Math.min(
            Math.max(0, this.camera.position.x),
            this.mapColumns * this.unitLength - this.camera.width
        );

        this.camera.position.y = Math.min(
            Math.max(0, this.camera.position.y),
            this.mapRows * this.unitLength - this.camera.height
        );
    }
}


export {
    ICamera2D,
    Camera2D,
    KeyPressControlledCameraPosition2D
}