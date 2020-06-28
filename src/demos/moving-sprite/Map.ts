import { IRenderable2D } from "../../2d/Renderable2D.js";
import { Brick } from "./Brick.js";
import { ICamera2D } from "../../2d/Camera2D.js";
import { Vector2D } from "../../2d/Vector2D.js";

class Map implements IRenderable2D {
    constructor(
            private bricks: Brick[],
            private camera: ICamera2D) {
        this.bricks = bricks;
        this.camera = camera;
    }

    inCamera(camera: ICamera2D, position: Vector2D): boolean {
        return true;
    }

    draw(canvas: CanvasRenderingContext2D, position: Vector2D): void {
        this.bricks.forEach(x => {
            const coordinates = x.getWorldCoordinates();

            if (x.renderable.inCamera(this.camera, coordinates)) {
                let cameraFrameCoordinates = (
                    this.camera.getCameraFrameCoordinates(coordinates));

                x.renderable.draw(canvas, cameraFrameCoordinates);
            }
        });
    }
}


export {
    Map
}