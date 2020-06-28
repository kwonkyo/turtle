import { IRenderable2D } from "../../2d/Renderable2D";
import { RectangleCollisionBound } from "../../2d/CollisionBound2D.js";
import { ICamera2D } from "../../2d/Camera2D.js";
import { Vector2D } from "../../2d/Vector2D.js";
import { ICollidable2D } from "../../2d/Collidable2D";
import { Vector } from "../../Math";

class Brick implements IRenderable2D, ICollidable2D<RectangleCollisionBound> {
    position: Vector2D;
    lastPosition: Vector2D;

    constructor(
            private mapIndex: number,
            public renderable: IRenderable2D,
            private mapColumns: number,
            private unitLength: number,
            public isWall: boolean) {
        this.mapIndex = mapIndex;
        this.renderable = renderable;
        this.mapColumns = mapColumns;
        this.unitLength = unitLength;
        this.isWall = isWall;

        this.position = this.lastPosition = this.getWorldCoordinates();
    }

    inCamera(camera: ICamera2D, position: Vector2D): boolean {
        return this.renderable.inCamera(camera, position);
    }

    draw(canvas: CanvasRenderingContext2D, position: Vector2D): void {
        this.renderable.draw(canvas, position);
    }

<<<<<<< HEAD
    getWorldCoordinates() : Vector2D {
        return new Vector2D(
            (this.mapIndex % this.mapColumns) * this.unitLength,
            Math.floor(this.mapIndex / this.mapColumns) * this.unitLength);
    }

=======
>>>>>>> 15796c7ba0088d07f6ccb5538962325885ec245c
    getCollisionBound(): RectangleCollisionBound {
        let coordinates = this.getWorldCoordinates();

        return new RectangleCollisionBound(
            new Vector2D(coordinates.x, coordinates.y),
            new Vector2D(coordinates.x + this.unitLength, coordinates.y),
            new Vector2D(coordinates.x, coordinates.y + this.unitLength),
            new Vector2D(coordinates.x + this.unitLength, coordinates.y + this.unitLength)
        )
    }
<<<<<<< HEAD
=======

    getWorldCoordinates() : Vector2D {
        return new Vector2D(
            (this.mapIndex % this.mapColumns) * this.unitLength,
            Math.floor(this.mapIndex / this.mapColumns) * this.unitLength);
    }
>>>>>>> 15796c7ba0088d07f6ccb5538962325885ec245c
}


export {
    Brick
}