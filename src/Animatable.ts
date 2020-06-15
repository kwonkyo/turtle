import { IAnimationState } from "./AnimationState.js";

interface IAnimatable {
    animate(state: IAnimationState) : void;
}


export {
    IAnimatable
}