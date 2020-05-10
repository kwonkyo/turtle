import { IControlState, KeyPressControlState, KEYCODE } from "./ControlState.js";
import { IControlEvent, KeyPressControlEvent } from "./ControlEvent.js";
import { ControlType } from "./ControlType.js";
import { IControllable } from "./Controllable.js";

/**
 * A controller that receives control events to update internal control states and
 * passes them to controllables.
 */
interface IController<T extends IControlEvent, K extends IControlState> {
    controlState: K;

    receives(controlEvent: T) : boolean;
    updateControlState(controlEvent: T) : void;
    canControl<V extends IControlState>(controllable: IControllable<V>) : boolean;
    control(controllable: IControllable<K>) : void;
}


class Controller<T extends IControlEvent, K extends IControlState>
        implements IController<T, K> {
    public controlState: K;

    constructor(state: K) {
        this.controlState = state;
    }

    receives(controlEvent: T): boolean {
        return controlEvent.type == this.controlState.type;
    }

    updateControlState(controlEvent: T): void {
        throw new Error("Method not implemented.");
    }

    canControl<V extends IControlState>(controllable: IControllable<V>) : boolean {
        return controllable.type === this.controlState.type;
    }
    
    control(controllable: IControllable<K>): void {
        controllable.obey(this.controlState);
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

    receives(controlEvent: KeyPressControlEvent) : boolean {
        return (
            super.receives(controlEvent) &&
            controlEvent.payload.keyCode === this.controlState.keyCode);
    }

    updateControlState(controlEvent: KeyPressControlEvent) : void {
        if (!this.controlState.pressed && controlEvent.payload.type == 'keydown') {
            this.controlState.hit = true;
        } else {
            this.controlState.hit = false;
        }

        this.controlState.pressed = controlEvent.payload.type == 'keydown';
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