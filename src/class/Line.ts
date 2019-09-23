class Line {
    x;
    y;
    startx;
    starty;
    axis;
    direction;
    color;
    width;
    height;

    constructor(runner) {
        this.x = runner.x;
        this.y = runner.y;
        this.startx = runner.x;
        this.starty = runner.y;
        this.axis = runner.axis;
        this.direction = runner.direction;
        this.color = "#000000";

        this.width = linew;
        this.height = linew;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}