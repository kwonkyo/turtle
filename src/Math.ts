interface IVector {
    add(other: IVector) : IVector;
    subtract(other: IVector) : IVector;
    multiply(other: IVector) : IVector;
    scale(magnitude: number) : IVector;
    interpolate(target: IVector, percent: number) : IVector;
    distance(other: IVector) : number;
    round() : IVector;
    copy() : IVector;
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

    distance(other: Vector) : number {
        return this.values
            .map((x, i) => (x - other.values[i])**2)
            .reduce((z, x) => z + x, 0);
    }

    round() : Vector {
        const rounded = this.values
            .map(x => Math.round(x));
        
        return new Vector(rounded)
    }

    copy(): Vector {
        return new Vector(this.values.slice());
    }
}


function linearInterpolate(
        start: number, end: number, percent: number, eps: number=1) : number {
    if (Math.abs(start - end) < eps) {
        return end;
    }

    return start * (1 - percent) + end * percent;
}


export {
    IVector,
    Vector,
    linearInterpolate
}