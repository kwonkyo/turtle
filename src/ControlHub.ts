import { IControllable } from "./Controllable.js";
import { IControlState } from "./ControlState.js";
import { IController } from "./Controls.js";
import { IControlEvent, KeyPressControlEvent } from "./ControlEvent.js";


/**
 * A control event hub
 */
interface IControlHub<T> {
    controllables: IControllable<IControlState>[];
    controls: IController<IControlEvent, IControlState>[];

    receive(input: T);
}

/**
 * JS event-based event hub
 */

class EventControlHub implements IControlHub<Event> {
    constructor(
            public controllables: IControllable<IControlState>[],
            public controls: IController<IControlEvent, IControlState>[]) {
        this.controllables = controllables;
        this.controls = controls;
    }

    receive(e: Event) {
        let controlEvent = this.createControlEvent(e);
        this.passControlEvent(controlEvent);
    }

    createControlEvent(e: Event) {
        if (e instanceof KeyboardEvent) {
            return new KeyPressControlEvent(e);
        } else {
            throw TypeError(
                `Unrecognized event while creating control event: ${e}`);
        }
    }

    passControlEvent(controlEvent: IControlEvent) {
        this.controls.forEach(controls => {
            if (controls.canReceive(controlEvent)) {
                controls.receive(controlEvent);

                this.passControlState(
                    controls.getControlState()
                );
            }
        });
    }

    passControlState(controlState: IControlState) {
        this.controllables.forEach(controllable => {
            if (controllable.controlType === controlState.type) {
                controllable.receive(controlState);
            }
        });
    }
}

export {
    IControlHub,
    EventControlHub
}
