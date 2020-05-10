import { IControllable } from "./Controllable.js";
import { IControlState } from "./ControlState.js";
import { IController } from "./Controller.js";
import { IControlEvent, KeyPressControlEvent } from "./ControlEvent.js";


/**
 * A control event hub
 */
interface IControlHub<T> {
    controllables: IControllable<IControlState>[];
    controllers: IController<IControlEvent, IControlState>[];

    receive(input: T);
}

/**
 * JS event-based event hub
 */

class EventControlHub implements IControlHub<Event> {
    constructor(
            public controllables: IControllable<IControlState>[],
            public controllers: IController<IControlEvent, IControlState>[]) {
        this.controllables = controllables;
        this.controllers = controllers;
    }

    receive(e: Event) {
        let controlEvent = this.createControlEvent(e);
        this.updateControllers(controlEvent);
        this.updateControllables();
    }

    createControlEvent(e: Event) {
        if (e instanceof KeyboardEvent) {
            return new KeyPressControlEvent(e);
        } else {
            throw TypeError(
                `Unrecognized event while creating control event: ${e}`);
        }
    }

    updateControllers(controlEvent: IControlEvent) {
        this.controllers.forEach(controller => {
            if (controller.canReceive(controlEvent)) {
                controller.receive(controlEvent);
            }
        });
    }

    updateControllables() {
        this.controllers.forEach(controller => {
            this.controllables.forEach(controllable => {
                if (controller.canControl(controllable)) {
                    controller.control(controllable);
                }
            });
        });
    }
}

export {
    IControlHub,
    EventControlHub
}
