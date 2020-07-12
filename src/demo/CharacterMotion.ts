import { KeyPressControlState, ControlType, KEYCODE } from "../ControlState.js";
import { IControllable } from "../Controllable.js";
import { Character } from "./Character.js";
import { Vector2D } from "../2d/Vector2D.js";
import { GRAVITY } from "./Constants.js";

class CharacterMotion implements IControllable<KeyPressControlState> {
    type: ControlType = ControlType.KEYPRESS;

    constructor(
            private character: Character,
            private acceleration: Vector2D) {
        this.character = character;
        this.acceleration = acceleration;
    }

    obey(controlState: KeyPressControlState) : void {
        if (controlState.keyCode === KEYCODE.LEFT_ARROW) {
            if (controlState.pressed) {
                this.character.velocity.x -= this.acceleration.x;
            }
        } else if (controlState.keyCode === KEYCODE.RIGHT_ARROW) {
            if (controlState.pressed) {
                this.character.velocity.x += this.acceleration.x;
            }
        } else if (controlState.keyCode === KEYCODE.UP_ARROW) {
            if (controlState.hit) {
                this.character.velocity.y -= this.acceleration.y;
                this.character.gravity = GRAVITY;
            }
        }
    }
}


export {
    CharacterMotion
}