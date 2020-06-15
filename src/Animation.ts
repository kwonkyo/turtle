import { IAnimationState } from "./AnimationState.js";

interface IAnimation {
    receiveAnimationState(state: IAnimationState) : void;
}


export {
    IAnimation
}