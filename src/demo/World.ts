import { IRenderable2D } from "../2d/Renderable2D.js";
import { Brick } from "./Brick.js";
import { ICamera2D } from "../2d/Camera2D.js";
import { Vector2D } from "../2d/Vector2D.js";
import { GRAVITY } from "./Constants.js";

interface IWorld {
    getGravity(coordinates: Vector2D) : number;
}

class World implements IWorld, IRenderable2D {
    private castLength: number = 1;
    constructor(
            private bricks: Brick[],
            private camera: ICamera2D) {
        this.bricks = bricks;
        this.camera = camera;
    }

    getGravity(coordinates: Vector2D): number {
        let checkPosition = coordinates.add(
            new Vector2D(0, this.castLength));

        if (this.getBrickAt(checkPosition).isWall) {
            return 0;
        }

        return GRAVITY;
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

    private getBrickAt(coordinates: Vector2D) : Brick{
        let unitLength = this.bricks[0].unitLength;
        let mapColumns = this.bricks[0].mapColumns;
        
        let column = Math.floor(coordinates.x / unitLength);
        let row = Math.floor(coordinates.y / unitLength);

        return this.bricks[row * mapColumns + column];
    }
}


export {
    IWorld,
    World
}