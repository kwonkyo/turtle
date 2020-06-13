import { IAnimation } from "../Animation";

interface IFrame2D {
    getFrame() : HTMLImageElement;
}


class Frame2D implements IFrame2D {
    private image: HTMLImageElement;

    constructor(source: string) {
        this.image = new Image();
        this.image.src = source;
    }

    getFrame(): HTMLImageElement {
        return this.image;
    }
}


class FrameAnimation2D implements IFrame2D, IAnimation {
    private currentAnimationState: IAnimationState;
    private currentFrameIndex: number;

    constructor(
            private frames: Record<string, Frame2D[]>,
            private frameRate: number,
            initialAnimationState: IAnimationState) {
        this.frames = frames;
        this.currentAnimationState = initialAnimationState;
        this.currentFrameIndex = 0;
    }

    getFrame(): HTMLImageElement {
        let frame = this.frames
            [this.currentAnimationState.name]
            [this.currentFrameIndex]
            .getFrame();
        
        this.currentFrameIndex++;
        this.currentFrameIndex %= this.frames[this.currentAnimationState.name].length;

        return frame;
    }

    receiveAnimationState(state: IAnimationState): void {
        if (this.currentAnimationState !== state) {
            this.currentAnimationState = state;
            this.currentFrameIndex = 0;
        }
    }
}


export {
    IFrame2D,
    Frame2D,
    FrameAnimation2D
}