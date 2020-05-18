import { IRenderable2D } from "./Renderable2D.js";
import { Vector2D } from "./Vector2D.js";


class RenderRequest2D {
    constructor(
            public renderable: IRenderable2D,
            public position: Vector2D,
            public priority: number) {
        this.renderable = renderable;
        this.position = position;
        this.priority = priority;
    }
}


export {
    RenderRequest2D
}