import { ControlType } from "./ControlType.js";

/**
 * A control state.
 */
interface IControlState {
    type: ControlType;
}

/**
 * Key codes.
 */
enum KEYCODE {
    LEFT_ARROW = 37,
    UP_ARROW = 38,
    RIGHT_ARROW = 39,
    DOWN_ARROW = 40
}

/**
 * A key-press control state.
 */
class KeyPressControlState implements IControlState {
    public type: ControlType = ControlType.KEYPRESS;
    public keyCode: KEYCODE;
    public pressed: boolean;
    public hit: boolean;

    constructor(keyCode: KEYCODE) {
        this.pressed = false;
        this.hit = false;
        this.keyCode = keyCode;
    }
}


export {
    ControlType,
    IControlState,
    KeyPressControlState,
    KEYCODE
}