import { IAnimationState } from "./AnimationState.js";

interface IAnimatable {
    getAnimationState() : IAnimationState;
}


export {
    IAnimatable
}