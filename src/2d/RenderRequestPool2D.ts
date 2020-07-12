import { RenderRequest2D } from "./RenderRequest2D";


interface IRenderRequestPool2D {
    requests: RenderRequest2D[];

    add(request: RenderRequest2D): IRenderRequestPool2D;
}


class RenderRequestPool2D implements IRenderRequestPool2D {
    requests: RenderRequest2D[] = [];

    add(request: RenderRequest2D): RenderRequestPool2D {
        this.requests.push(request);
        this.requests.sort((a, b) => a.priority - b.priority);

        return this;
    }
}


export {
    IRenderRequestPool2D,
    RenderRequestPool2D
}