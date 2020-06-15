import { IAnimatedModel } from "./AnimatedModel.js";
import { IAnimatable } from "./Animatable.js";


/**
 * Animators take the latest animation state from animated models
 * and pass them on to animatables.
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