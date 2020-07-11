import { KeyPressControlState, ControlType, KEYCODE } from "../ControlState.js";
import { IControllable } from "../Controllable.js";
import { Golem } from "./Golem.js";
import { Vector2D } from "../2d/Vector2D.js";
import { GRAVITY } from "./Constants.js";

class KeyPressControlledGolem implements IControllable<KeyPressControlState> {
    type: ControlType = ControlType.KEYPRESS;

    constructor(
            private golem: Golem,
            private acceleration: Vector2D) {
        this.golem = golem;
        this.acceleration = acceleration;
    }

    obey(controlState: KeyPressControlState) : void {
        if (controlState.keyCode === KEYCODE.LEFT_ARROW) {
            if (controlState.pressed) {
                this.golem.velocity.x -= this.acceleration.x;
            } else if (controlState.released) {
                this.golem.velocity.x = 0;
            }
        } else if (controlState.keyCode === KEYCODE.RIGHT_ARROW) {
            if (controlState.pressed) {
                this.golem.velocity.x += this.acceleration.x;
            } else if (controlState.released) {
                this.golem.velocity.x = 0;
            }
        } else if (controlState.keyCode === KEYCODE.UP_ARROW) {
            if (controlState.hit) {
                this.golem.velocity.y -= this.acceleration.y;
                this.golem.gravity = GRAVITY;
            }
        }
    }
}


export {
    KeyPressControlledGolem
}