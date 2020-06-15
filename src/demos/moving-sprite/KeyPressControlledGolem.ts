import { KeyPressControlState, ControlType, KEYCODE } from "../../ControlState.js";
import { IControllable } from "../../Controllable.js";
import { Golem } from "./Golem.js";
import { Vector2D } from "../../2d/Vector2D.js";

class KeyPressControlledGolem implements IControllable<KeyPressControlState> {
    type: ControlType = ControlType.KEYPRESS;

    constructor(
            private golem: Golem,
            private acceleration: Vector2D) {
        this.golem = golem;
        this.acceleration = acceleration;
    }

    obey(controlState: KeyPressControlState) : void {
        if (!controlState.pressed) {
            return;
        }

        if (controlState.keyCode === KEYCODE.LEFT_ARROW) {
            this.golem.velocity.x -= this.acceleration.x;
        } else if (controlState.keyCode === KEYCODE.UP_ARROW) {
            this.golem.velocity.y -= this.acceleration.y;
        } else if (controlState.keyCode === KEYCODE.RIGHT_ARROW) {
            this.golem.velocity.x += this.acceleration.x;
        } else if (controlState.keyCode === KEYCODE.DOWN_ARROW) {
            this.golem.velocity.y += this.acceleration.y;
        }
    }
}


export {
    KeyPressControlledGolem
}