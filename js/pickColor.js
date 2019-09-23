function pickColor() {
    var n = Math.random();
    if (n < 0.25)
        return 'yellow';
    if (n < 0.5)
        return 'red';
    if (n < 0.75)
        return 'blue';
    n = Math.random();
    if (n < 0.4)
        return 'white';
    if (n < 0.95)
        return 'black';
    return 'red';
}
