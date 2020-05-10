import { IControlState } from "./ControlState.js";
import { ControlType } from "./ControlType.js";

/**
 * An controllable object that responds to control states.
 */
interface IControllable<T extends IControlState> {
    type: ControlType;

    respond(controlState: T) : void;
}


export {
    IControllable
}