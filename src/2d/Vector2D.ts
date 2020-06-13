import { linearInterpolate, IVector, Vector } from '../Math.js';
import { IControllable } from '../Controllable.js';
import { KeyPressControlState, ControlType, KEYCODE } from '../ControlState.js';


class Vector2D implements IVector {
    private vector: Vector;

    constructor(x: number, y: number) {
        this.vector = new Vector([x, y]);
    }

    get x() { return this.vector.values[0]; }
    set x(value) { this.vector.values[0] = value; }

    get y() { return this.vector.values[1]; }
    set y(value) { this.vector.values[1] = value; }

    add(other: Vector2D) : Vector2D {
        return this.fromVector(
            this.vector.add(other.vector));
    }

    subtract(other: Vector2D) : Vector2D {
        return this.fromVector(
            this.vector.subtract(other.vector));
    }

    multiply(other: Vector2D) : Vector2D {
        return this.fromVector(
            this.vector.multiply(other.vector));
    }

    scale(magnitude: number) : Vector2D {
        return this.fromVector(
            this.vector.scale(magnitude));
    }

    interpolate(target: Vector2D, percent: number) : Vector2D {
        return this.fromVector(
            this.vector.interpolate(target.vector, percent));
    }

    private fromVector(vector: Vector) {
        return new Vector2D(
            vector.values[0], vector.values[1]);
    }
}


class KeyPressControlledPosition2D implements IControllable<KeyPressControlState> {
    type: ControlType = ControlType.KEYPRESS;

    constructor(
            private speed: number,
            private position: Vector2D) {
        this.speed = speed;
        this.position = position;
    }

    obey(controlState: KeyPressControlState) : void {
        if (!controlState.pressed) {
            return;
        }

        if (controlState.keyCode === KEYCODE.LEFT_ARROW) {
            this.position.x -= this.speed;
        } else if (controlState.keyCode === KEYCODE.UP_ARROW) {
            this.position.y -= this.speed;
        } else if (controlState.keyCode === KEYCODE.RIGHT_ARROW) {
            this.position.x += this.speed;
        } else if (controlState.keyCode === KEYCODE.DOWN_ARROW) {
            this.position.y += this.speed;
        }
    }
}


export {
    Vector2D,
    KeyPressControlledPosition2D
}