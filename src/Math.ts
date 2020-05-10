function linearInterpolate(start: number, end: number, percent: number) : number {
    return start * (1 - percent) + end * percent;
}


export {
    linearInterpolate
}