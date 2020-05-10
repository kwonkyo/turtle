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

    receive(input: T) : void;
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

    receive(event: Event) : void {
        let controlEvent = this.createControlEvent(event);

        this.updateControllers(controlEvent);
        this.updateControllables();
    }

    private createControlEvent(event: Event) : IControlEvent {
        if (event instanceof KeyboardEvent) {
            return new KeyPressControlEvent(event);
        } else {
            throw TypeError(
                `Unrecognized event while creating control event: ${event}`);
        }
    }

    private updateControllers(controlEvent: IControlEvent) : void {
        this.controllers.forEach(controller => {
            if (controller.receives(controlEvent)) {
                controller.updateControlState(controlEvent);
            }
        });
    }

    private updateControllables() : void {
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
