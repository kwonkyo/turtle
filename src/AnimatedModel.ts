import { IAnimationState } from "./AnimationState.js";
import { IModel } from "./Model.js";

interface IAnimatedModel extends IModel {
    getAnimationState() : IAnimationState;
}


export {
    IAnimatedModel
}