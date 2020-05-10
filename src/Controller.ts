import { IControllable } from "./Controllable.js";
import { IControlState } from "./ControlState.js";
import { IControls, KeyPressControls } from "./Controls.js";
import { IControlEvent, KeyPressControlEvent } from "./ControlEvent.js";


/**
 * Executes control flow on controllables.
 */
interface IController<T> {
    controllables: IControllable<IControlState>[];
    controls: IControls<IControlEvent, IControlState>[];

    control(input: T);
}

/**
 * JS event-based controller.
 */

class EventController implements IController<Event> {
    constructor(
            public controllables: IControllable<IControlState>[],
            public controls: IControls<IControlEvent, IControlState>[]) {
        this.controllables = controllables;
        this.controls = controls;
    }

    control(e: Event) {
        let controlEvent = this.getControlEvent(e);

        this.controls.forEach(controls => {
            if (controls.canReceive(controlEvent)) {
                controls.receive(controlEvent);

                this.passControlState(
                    controls.getControlState()
                );
            }
        })
    }

    getControlEvent(e: Event) {
        if (e instanceof KeyboardEvent) {
            return new KeyPressControlEvent(e);
        } else {
            throw TypeError(
                `Unrecognized control event: ${e}`);
        }
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
    IController,
    EventController
}
