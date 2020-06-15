import { IAnimatedModel } from "./AnimatedModel.js";
import { IAnimatable } from "./Animatable.js";


/**
 * Animators instruct IAnimatables to update their animation state,
 * and then passes the new state to the corresponding IAnimation object
 * which will update the frame.
 */
interface IAnimator<T extends IAnimatedModel, K extends IAnimatable> {
    animate(model: T, animatable: K) : void;
}


class Animator<T extends IAnimatedModel, K extends IAnimatable> implements IAnimator<T, K> {
    animate(model: T, animatable: K) : void {
        let animationState = model.getAnimationState();

        animatable.animate(animationState);
    }
}


export {
    IAnimator,
    Animator
}