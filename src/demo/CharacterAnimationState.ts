import { IAnimationState } from "../AnimationState.js";


class CharacterAnimationState implements IAnimationState {
    constructor(public name: string) {
        this.name = name;
    }

    static IDLE_RIGHT = new CharacterAnimationState('idle-right');
    static IDLE_LEFT = new CharacterAnimationState('idle-left');
    static WALKING_RIGHT = new CharacterAnimationState('walking-right');
    static WALKING_LEFT = new CharacterAnimationState('walking-left');
}


export {
    CharacterAnimationState
}