import { ICamera2D } from './Camera2D.js';
import { Vector2D } from './Vector2D.js';
import { IFrame2D } from './Frame2D.js';


interface IRenderable2D {
    inCamera(camera: ICamera2D, position: Vector2D) : boolean;
    draw(canvas: CanvasRenderingContext2D, position: Vector2D) : void;
}


abstract class VertexBasedRenderable2D implements IRenderable2D {
    inCamera(camera: ICamera2D, position: Vector2D) : boolean {
        return this
            .getVertices(position.x, position.y)
            .some(v => camera.inField(v));
    }

    abstract draw(canvas: CanvasRenderingContext2D, position: Vector2D) : void;
    protected abstract getVertices(x: number, y: number) : Vector2D[];
}

class Rectangle extends VertexBasedRenderable2D {
    constructor(
            private name: string,
            private color: string,
            private width: number,
            private height: number) {
        super();

        this.name = name;
        this.color = color;
        this.width = width;
        this.height = height;
    }

    draw(canvas: CanvasRenderingContext2D, position: Vector2D) : void {
        canvas.fillStyle = this.color;
        canvas.fillRect(position.x, position.y, this.width, this.height);
    }

    protected getVertices(x: number, y: number): Vector2D[] {
        return [
            new Vector2D(x, y),
            new Vector2D(x + this.width, y),
            new Vector2D(x, y + this.height),
            new Vector2D(x + this.width, y + this.height)
        ];
    }
}


class FrameRenderable2D extends VertexBasedRenderable2D {
    constructor(
            public frame: IFrame2D, private width: number, private height: number) {
        super();

        this.width = width;
        this.height = height;
    }

    draw(canvas: CanvasRenderingContext2D, position: Vector2D): void {
        let frame = this.frame.getFrame();
        
        canvas.drawImage(
            frame, 0, 0, frame.width, frame.height,
            position.x, position.y, this.width, this.height);
    }

    protected getVertices(x: number, y: number): Vector2D[] {
        return [
            new Vector2D(x, y),
            new Vector2D(x + this.width, y),
            new Vector2D(x, y + this.height),
            new Vector2D(x + this.width, y + this.height)
        ];
    }
}


export {
    IRenderable2D,
    Rectangle,
    FrameRenderable2D
}