import { ICamera2D } from './Camera2D.js';
import { Vector2D } from './Vector2D.js';


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


class ImageRenderable extends VertexBasedRenderable2D {
    private image: HTMLImageElement;

    constructor(
            source: string, private width: number, private height: number) {
        super();

        this.image = new Image();
        this.image.src = source;

        this.width = width;
        this.height = height;
    }

    draw(canvas: CanvasRenderingContext2D, position: Vector2D): void {
        canvas.drawImage(
            this.image, 0, 0, this.image.width, this.image.height,
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
    ImageRenderable
}