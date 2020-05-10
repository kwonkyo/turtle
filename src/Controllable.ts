import { IControlState } from "./ControlState.js";
import { ControlType } from "./ControlType.js";

/**
 * An controllable object that receives control states.
 */
interface IControllable<T extends IControlState> {
    controlType: ControlType;

    receive(controlState: T) : void;
}


export {
    IControllable
}