class Vector2D {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(other: Vector2D) {
        return new Vector2D(
            this.x + other.x,
            this.y + other.y
        );
    }

    subtract(other: Vector2D) {
        return this.add(
            new Vector2D(-other.x, -other.y)
        );
    }

    multiply(other: Vector2D) {
        return new Vector2D(
            this.x * other.x, this.y * other.y
        );
    }

    scale(magnitude: number) {
        return this.multiply(new Vector2D(magnitude, magnitude));
    }
}


export {
    Vector2D
}