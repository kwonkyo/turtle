import { ICollisionResolution } from "./CollisionResolution";

interface ICollisionResponse {
    resolveA: ICollisionResolution;
    resolveB: ICollisionResolution;
}


export {
    ICollisionResponse
}