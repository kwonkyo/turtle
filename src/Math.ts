interface IVector {
    add(other: IVector);
    subtract(other: IVector);
    multiply(other: IVector);
    scale(magnitude: number);
    interpolate(target: IVector, percent: number);
}


class Vector implements IVector {
    constructor(public values: number[]) {
        this.values = values;
    }

    add(other: Vector) : Vector {
        const sums = this.values.map(
            (x, i) => x + other.values[i]);

        return new Vector(sums);
    }

    subtract(other: Vector) : Vector {
        const negOther = new Vector(
            other.values.map(x => -x));

        return this.add(negOther);
    }

    multiply(other: Vector) : Vector {
        const products = this.values.map(
            (x, i) => x * other.values[i]);
        
        return new Vector(products)
    }

    scale(magnitude: number) : Vector {
        const other = new Vector(
            Array(this.values.length).fill(magnitude)
        );

        return this.multiply(other);
    }

    interpolate(target: Vector, percent: number) : Vector {
        const interpolated = this.values
            .map((x, i) => linearInterpolate(
                x, target.values[i], percent));

        return new Vector(interpolated);
    }
}


function linearInterpolate(start: number, end: number, percent: number) : number {
    return start * (1 - percent) + end * percent;
}


export {
    IVector,
    Vector,
    linearInterpolate
}