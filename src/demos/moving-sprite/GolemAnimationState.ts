import { IAnimationState } from "../../AnimationState.js";


class GolemAnimationState implements IAnimationState {
    constructor(public name: string) {
        this.name = name;
    }

    static IDLE = new GolemAnimationState('idle');
    static IDLE_LEFT = new GolemAnimationState('idle-left');
    static WALKING = new GolemAnimationState('walking');
    static WALKING_LEFT = new GolemAnimationState('walking-left');
}


export {
    GolemAnimationState
}