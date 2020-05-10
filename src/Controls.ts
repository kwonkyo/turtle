import { IControlState, KeyPressControlState, KEYCODE } from "./ControlState.js";
import { IControlEvent, KeyPressControlEvent } from "./ControlEvent.js";
import { ControlType } from "./ControlType.js";

/**
 * A controller that receives control events to produce control states.
 * It can only receive control events of the same control type as the control state.
 */
interface IController<T extends IControlEvent, K extends IControlState> {
    state: K;

    canReceive(e: T) : boolean;
    receive(e: T) : void;
    getControlState() : K;
}

class Controller<T extends IControlEvent, K extends IControlState>
        implements IController<T, K> {
    state: K;

    constructor(state: K) {
        this.state = state;
    }

    canReceive(e: T): boolean {
        return e.type == this.state.type;
    }

    receive(e: T): void {
        throw new Error("Method not implemented.");
    }

    getControlState(): K {
        return this.state;
    }
    
}

/**
 * A key-press controller.
 */
class KeyPressController extends Controller<KeyPressControlEvent, KeyPressControlState> {
    public type: ControlType = ControlType.KEYPRESS;

    constructor(keyCode) {
        super(new KeyPressControlState(keyCode));
    }

    canReceive(e: KeyPressControlEvent) : boolean {
        return (
            super.canReceive(e) &&
            e.payload.keyCode === this.state.keyCode);
    }

    receive(e: KeyPressControlEvent) : void {
        this.state.pressed = e.payload.type == 'keydown';

        if (!this.state.hit && e.payload.type == 'keydown') {
            this.state.hit = true;
        } else {
            this.state.hit = false;
        }
    }

    static LEFT_ARROW = new KeyPressController(KEYCODE.LEFT_ARROW);
    static UP_ARROW = new KeyPressController(KEYCODE.UP_ARROW);
    static RIGHT_ARROW = new KeyPressController(KEYCODE.RIGHT_ARROW);
    static DOWN_ARROW = new KeyPressController(KEYCODE.DOWN_ARROW);
}


export {
    IController,
    KeyPressController
}