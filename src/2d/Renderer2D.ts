import { IRenderer } from '../Renderer.js';
import { GameState2D } from './GameState2D.js';
import { ICamera2D } from './Camera2D.js';
import { Vector2D } from './Vector2D.js';
import { IRenderable2D } from './Renderable2D.js';
import { IRenderRequestPool2D } from './RenderRequestPool2D.js';


class Renderer2D implements IRenderer<GameState2D> {
    private buffer: CanvasRenderingContext2D;

    constructor(
        private context: CanvasRenderingContext2D,
        private camera: ICamera2D,
        private pool: IRenderRequestPool2D,
        private callback: () => void=() => {}
    ) {
        this.buffer = document
            .createElement('canvas')
            .getContext('2d');
        this.context = context;

        this.camera = camera;
        this.pool = pool;
        this.callback = callback;
    }

    render(state: GameState2D): void {
        this.clearBuffer();

        for (const request of this.pool.requests) {
            if (request.renderable.inCamera(this.camera, request.position)) {
                request.renderable.draw(
                    this.buffer,
                    this.camera.getCameraFrameCoordinates(request.position));
            }
        }

        this.drawCanvas();
        this.callback();
    }

    private clearBuffer() : void {
        this.buffer.canvas.width = this.camera.width;
        this.buffer.canvas.height = this.camera.height;

        this.buffer.clearRect(
            0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    }

    
    private drawCanvas() : void {
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


export {
    Renderer2D
}