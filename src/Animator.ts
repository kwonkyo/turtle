import { IAnimatable } from "./Animatable.js";
import { IAnimation } from "./Animation.js";


/**
 * Animators instruct IAnimatables to update their animation state,
 * and then passes the new state to the corresponding IAnimation object
 * which will update the frame.
 */
interface IAnimator<T extends IAnimatable, K extends IAnimation> {
    animate(animatable: T, animation: K) : void;
}


class Animator<T extends IAnimatable, K extends IAnimation> implements IAnimator<T, K> {
    animate(animatable: T, animation: K) : void {
        let animationState = animatable.getAnimationState();

        animation.receiveAnimationState(animationState);
    }
}


export {
    IAnimator,
    Animator
}