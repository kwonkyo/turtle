import { IRenderer } from '../Renderer.js';
import { GameState2D } from './GameState2D.js';
import { Camera2D } from './Camera2D.js';
import { Vector2D } from './Vector2D.js';


class Renderer2D implements IRenderer<GameState2D> {
    private buffer: CanvasRenderingContext2D;
    private renderables: Record<number, IRenderable2D>;

    constructor(
        private context: CanvasRenderingContext2D,
        private camera: Camera2D,
        public tiles: Record<number, Record<string, string>>,
        private unitLength: number
    ) {
        this.buffer = document
            .createElement('canvas')
            .getContext('2d');
        this.context = context;
        
        this.renderables = Object.keys(tiles)
            .map(k => [parseInt(k), new Rectangle(
                tiles[k]['name'], tiles[k]['color'],
                unitLength, unitLength)]
            )
            .reduce((z, x) => {
                z[(<[number, Rectangle]> x)[0]] = x[1]

                return z;
            }, {});
        this.unitLength = unitLength;
        this.camera = camera;
    }

    render(state: GameState2D): void {
        this.clearBuffer();

        this.drawMap(state);
        this.drawCanvas();
    }

    private clearBuffer() {
        this.buffer.canvas.width = this.camera.width;
        this.buffer.canvas.height = this.camera.height;

        this.buffer.clearRect(
            0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    }

    private drawMap(state: GameState2D): void {
        for (let i = 0; i < state.map.length; i++) {
            const coordinates = this.getWorldCoordinates(
                i, state.width);
            const renderable = this.getRenderable(state.map, i);

            const inCamera = renderable
                .getCorners(coordinates.x, coordinates.y)
                .some(v => this.camera.inField(v));

            if (inCamera) {
                let cameraFrameCoordinates = (
                    this.camera.getCameraFrameCoordinates(coordinates)
                );
    
                renderable.draw(
                    this.buffer,
                    cameraFrameCoordinates.x, cameraFrameCoordinates.y);
            }
        }
    }

    private getWorldCoordinates(mapIndex, mapWidth) {
        return new Vector2D(
            (mapIndex % mapWidth) * this.unitLength,
            Math.floor(mapIndex / mapWidth) * this.unitLength);
    }

    private getRenderable(map, mapIndex) {
        let renderableIndex = map[mapIndex];
        let renderable = this.renderables[renderableIndex];

        return renderable;
    }

    private drawCanvas() {
        this.context.canvas.width = this.camera.width;
        this.context.canvas.height = this.camera.height;

        this.context.clearRect(
            0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.drawImage(
            this.buffer.canvas,
            0, 0, this.camera.width, this.camera.height,
            0, 0, this.context.canvas.width, this.context.canvas.height);
    }
}


interface IRenderable2D {
    draw(
        canvas: CanvasRenderingContext2D, x: number, y: number);
    
    getCorners(x: number, y: number) : Vector2D[];
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

    draw(canvas: CanvasRenderingContext2D, x: number, y: number) {
        canvas.fillStyle = this.color;

        const [xClamped, widthClamped] = this.clamp1d(x, this.width);
        const [yClamped, heightClamped] = this.clamp1d(y, this.height);

        canvas.fillRect(xClamped, yClamped, widthClamped, heightClamped);
    }

    getCorners(x: number, y: number) : Vector2D[] {
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
    Renderer2D
}