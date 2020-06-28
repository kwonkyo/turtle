import { AnimatedFrame2D, Frame2D } from "../2d/Frame2D.js";
import { GolemAnimationState } from "./GolemAnimationState.js";


class GolemFrame extends AnimatedFrame2D {
    static FRAMES : Record<string, Frame2D[]> = {
        "idle": [...Array(11).keys()]
            .map(x => String(x).padStart(3, '0'))
            .map(x => `assets/Golem_01/Idle/Golem_01_Idle_${x}.png`)
            .map(x => new Frame2D(x)),
        "idle-left": [...Array(11).keys()]
            .map(x => String(x).padStart(3, '0'))
            .map(x => `assets/Golem_01/Idle Left/Golem_01_Idle_${x}.png`)
            .map(x => new Frame2D(x)),
        "walking": [...Array(17).keys()]
            .map(x => String(x).padStart(3, '0'))
            .map(x => `assets/Golem_01/Walking/Golem_01_Walking_${x}.png`)
            .map(x => new Frame2D(x)),
        "walking-left": [...Array(17).keys()]
            .map(x => String(x).padStart(3, '0'))
            .map(x => `assets/Golem_01/Walking Left/Golem_01_Walking_${x}.png`)
            .map(x => new Frame2D(x)),
    }

    constructor() {
        super(GolemFrame.FRAMES, 30 / 1000, GolemAnimationState.IDLE);
    }
}


export {
    GolemFrame
}