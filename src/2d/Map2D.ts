import { IRenderable2D } from "./Renderable2D.js";
import { ICamera2D } from "./Camera2D.js";
import { Vector2D } from "./Vector2D.js";


class Map2D implements IRenderable2D {
    constructor(
            private map: number[],
            private bricks: Record<number, IRenderable2D>,
            private mapColumns: number,
            private unitLength: number,
            private camera: ICamera2D) {
        this.map = map;
        this.bricks = bricks;
        this.mapColumns = mapColumns;
        this.unitLength = unitLength;
        this.camera = camera;
    }

    inCamera(camera: ICamera2D, position: Vector2D): boolean {
        return true;
    }

    draw(canvas: CanvasRenderingContext2D, position: Vector2D): void {
        for (let i = 0; i < this.map.length; i++) {
            const coordinates = this.getWorldCoordinates(
                i, this.mapColumns);
            const renderable = this.getRenderable(this.map, i);

            if (renderable.inCamera(this.camera, coordinates)) {
                let cameraFrameCoordinates = (
                    this.camera.getCameraFrameCoordinates(coordinates));
    
                renderable.draw(canvas, cameraFrameCoordinates);
            }
        }
    }

    private getWorldCoordinates(mapIndex, mapWidth) : Vector2D {
        return new Vector2D(
            (mapIndex % mapWidth) * this.unitLength,
            Math.floor(mapIndex / mapWidth) * this.unitLength);
    }

    private getRenderable(map, mapIndex) : IRenderable2D {
        return this.bricks[map[mapIndex]];
    }
}


export {
    Map2D
}