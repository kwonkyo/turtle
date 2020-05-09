import { Vector2D } from "./Vector2D";

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


export {
    Camera2D
}