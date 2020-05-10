import { IRenderer } from '../Renderer.js';
import { GameState2D } from './GameState2D.js';
import { ICamera2D } from './Camera2D.js';
import { Vector2D } from './Vector2D.js';
import { IRenderable2D } from './Renderable2D.js';


class Renderer2D implements IRenderer<GameState2D> {
    private buffer: CanvasRenderingContext2D;

    constructor(
        private context: CanvasRenderingContext2D,
        private camera: ICamera2D,
        private renderables: Record<number, IRenderable2D>,
        private unitLength: number
    ) {
        this.buffer = document
            .createElement('canvas')
            .getContext('2d');
        this.context = context;
        
        this.renderables = renderables;
        this.unitLength = unitLength;
        this.camera = camera;
    }

    render(state: GameState2D): void {
        this.clearBuffer();

        this.drawMap(state);
        this.drawCanvas();
    }

    private clearBuffer() : void {
        this.buffer.canvas.width = this.camera.width;
        this.buffer.canvas.height = this.camera.height;

        this.buffer.clearRect(
            0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    }

    private drawMap(state: GameState2D) : void {
        for (let i = 0; i < state.map.length; i++) {
            const coordinates = this.getWorldCoordinates(
                i, state.width);
            const renderable = this.getRenderable(state.map, i);

            if (renderable.inCamera(this.camera, coordinates)) {
                let cameraFrameCoordinates = (
                    this.camera.getCameraFrameCoordinates(coordinates));
    
                renderable.draw(this.buffer, cameraFrameCoordinates);
            }
        }
    }

    private getWorldCoordinates(mapIndex, mapWidth) : Vector2D {
        return new Vector2D(
            (mapIndex % mapWidth) * this.unitLength,
            Math.floor(mapIndex / mapWidth) * this.unitLength);
    }

    private getRenderable(map, mapIndex) : IRenderable2D {
        const renderableIndex = map[mapIndex];
        const renderable = this.renderables[renderableIndex];

        return renderable;
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