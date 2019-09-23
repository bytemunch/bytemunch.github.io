var Line = (function () {
    function Line(runner) {
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
    Line.prototype.draw = function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    return Line;
}());
