import { ICamera2D } from './Camera2D.js';
import { Vector2D } from './Vector2D.js';


interface IRenderable2D {
    inCamera(camera: ICamera2D, position: Vector2D);
    draw(canvas: CanvasRenderingContext2D, position: Vector2D);
}


class Rectangle implements IRenderable2D {
    constructor(
            private name: string,
            private color: string,
            private width: number,
            private height: number) {
        this.name = name;
        this.color = color;
        this.width = width;
        this.height = height;
    }

    inCamera(camera: ICamera2D, position: Vector2D) {
        return this
            .getCorners(position.x, position.y)
            .some(v => camera.inField(v));
    }

    draw(canvas: CanvasRenderingContext2D, position: Vector2D) {
        canvas.fillStyle = this.color;

        const [xClamped, widthClamped] = this.clamp1d(position.x, this.width);
        const [yClamped, heightClamped] = this.clamp1d(position.y, this.height);

        canvas.fillRect(xClamped, yClamped, widthClamped, heightClamped);
    }

    private getCorners(x: number, y: number) : Vector2D[] {
        return [
            new Vector2D(x, y),
            new Vector2D(x + this.width, y),
            new Vector2D(x, y + this.height),
            new Vector2D(x + this.width, y + this.height)
        ];
    }

    private clamp1d(position: number, length: number) {
        if (position < 0) {
            length += position;
            position = 0;
        }

        return [position, length];
    }
}


export {
    IRenderable2D,
    Rectangle
}