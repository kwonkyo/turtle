import { ControlType } from "./ControlType.js";

/**
 * A control event, which is the starting point of any control flow.
 */
interface IControlEvent {
    type: ControlType;
    payload: any;
}

/**
 * A key-press control event.
 */
class KeyPressControlEvent implements IControlEvent {
    public type: ControlType = ControlType.KEYPRESS;
    public payload: KeyboardEvent;

    constructor(payload: KeyboardEvent) {
        this.payload = payload;
    }
}


export {
    IControlEvent,
    KeyPressControlEvent
}