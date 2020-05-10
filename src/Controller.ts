import { IControlState, KeyPressControlState, KEYCODE } from "./ControlState.js";
import { IControlEvent, KeyPressControlEvent } from "./ControlEvent.js";
import { ControlType } from "./ControlType.js";
import { IControllable } from "./Controllable.js";

/**
 * A controller that receives control events and controls controllables.
 */
interface IController<T extends IControlEvent, K extends IControlState> {
    canReceive(controlEvent: T) : boolean;
    receive(controlEvent: T) : void;
    canControl<V extends IControlState>(controllable: IControllable<V>) : boolean;
    control(controllable: IControllable<K>) : void;
}

class Controller<T extends IControlEvent, K extends IControlState>
        implements IController<T, K> {
    public state: K;

    constructor(state: K) {
        this.state = state;
    }

    canReceive(controlEvent: T): boolean {
        return controlEvent.type == this.state.type;
    }

    receive(controlEvent: T): void {
        throw new Error("Method not implemented.");
    }

    canControl<V extends IControlState>(controllable: IControllable<V>) : boolean {
        return controllable.type === this.state.type;
    }
    
    control(controllable: IControllable<K>): void {
        controllable.respond(this.state);
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

    canReceive(controlEvent: KeyPressControlEvent) : boolean {
        return (
            super.canReceive(controlEvent) &&
            controlEvent.payload.keyCode === this.state.keyCode);
    }

    receive(controlEvent: KeyPressControlEvent) : void {
        if (!this.state.pressed && controlEvent.payload.type == 'keydown') {
            this.state.hit = true;
        } else {
            this.state.hit = false;
        }

        this.state.pressed = controlEvent.payload.type == 'keydown';
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