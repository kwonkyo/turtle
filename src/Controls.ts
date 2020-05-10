import { IControlState, KeyPressControlState, KEYCODE } from "./ControlState.js";
import { IControlEvent, KeyPressControlEvent } from "./ControlEvent.js";
import { ControlType } from "./ControlType.js";

/**
 * A control component that receives control events to produce control states.
 * It can only receive control events under the same control type as its control state.
 */
interface IControls<T extends IControlEvent, K extends IControlState> {
    controlState: K;

    canReceive(e: T) : boolean;
    receive(e: T) : void;
    getControlState() : K;
}

class Controls<T extends IControlEvent, K extends IControlState> implements IControls<T, K> {
    controlState: K;

    constructor(controlState: K) {
        this.controlState = controlState;
    }

    canReceive(e: T): boolean {
        return e.type == this.controlState.type;
    }

    receive(e: T): void {
        throw new Error("Method not implemented.");
    }

    getControlState(): K {
        return this.controlState;
    }
    
}

/**
 * A key-press control.
 */
class KeyPressControls extends Controls<KeyPressControlEvent, KeyPressControlState> {
    public type: ControlType = ControlType.KEYPRESS;

    constructor(keyCode) {
        super(new KeyPressControlState(keyCode));
    }

    canReceive(e: KeyPressControlEvent) : boolean {
        return (
            super.canReceive(e) &&
            e.payload.keyCode === this.controlState.keyCode);
    }

    receive(e: KeyPressControlEvent) : void {
        this.controlState.pressed = e.payload.type == 'keydown';

        if (!this.controlState.hit && e.payload.type == 'keydown') {
            this.controlState.hit = true;
        } else {
            this.controlState.hit = false;
        }
    }

    static LEFT = new KeyPressControls(KEYCODE.LEFT);
    static UP = new KeyPressControls(KEYCODE.UP);
    static RIGHT = new KeyPressControls(KEYCODE.RIGHT);
    static DOWN = new KeyPressControls(KEYCODE.DOWN);
}


export {
    IControls,
    KeyPressControls
}