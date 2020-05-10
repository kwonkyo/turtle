import { IControlState } from "./ControlState.js";
import { ControlType } from "./ControlType.js";

/**
 * An controllable object that obeys control states.
 */
interface IControllable<T extends IControlState> {
    type: ControlType;

    obey(controlState: T) : void;
}


export {
    IControllable
}