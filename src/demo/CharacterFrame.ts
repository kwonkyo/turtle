import { AnimatedFrame2D, Frame2D } from "../2d/Frame2D.js";
import { CharacterAnimationState } from "./CharacterAnimationState.js";


class CharacterFrame extends AnimatedFrame2D {
    static FRAMES : Record<string, Frame2D[]> = {
        "idle-right": [...Array(15).keys()]
            .map(x => `assets/victor/idle-right/${x+1}.png`)
            .map(x => new Frame2D(x)),
        "idle-left": [...Array(15).keys()]
            .map(x => `assets/victor/idle-left/${x+1}.png`)
            .map(x => new Frame2D(x)),
        "walking-right": [...Array(15).keys()]
            .map(x => `assets/victor/walking-right/${x+1}.png`)
            .map(x => new Frame2D(x)),
        "walking-left": [...Array(15).keys()]
            .map(x => `assets/victor/walking-left/${x+1}.png`)
            .map(x => new Frame2D(x))
    }

    constructor() {
        super(CharacterFrame.FRAMES, 30 / 1000, CharacterAnimationState.IDLE_RIGHT);
    }
}


export {
    CharacterFrame
}