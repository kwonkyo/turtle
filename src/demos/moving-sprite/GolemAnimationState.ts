import { IAnimationState } from "../../AnimationState.js";


class GolemAnimationState implements IAnimationState {
    constructor(public name: string) {
        this.name = name;
    }

    static IDLE = new GolemAnimationState('idle');
    static WALKING = new GolemAnimationState('walking');
}


export {
    GolemAnimationState
}