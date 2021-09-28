import { ctx, height, lineRunners, linew, width } from "../main.js";
import { Line } from "./Line.js";
import { checkCollision } from "../checkCollision.js";
export class LineRunner {
    constructor(x, y, axis, direction, parent) {
        this.x = x;
        this.y = y;
        this.width = linew;
        this.height = linew;
        this.axis = axis;
        this.direction = direction;
        this.speed = linew * 2;
        this.dead = false;
        this.color = "#FF0000";
        this.parent = parent;
        this.line = new Line(this);
    }
    update() {
        if (this.axis == 'x') {
            this.x += this.direction * this.speed;
            this.line.width += this.speed;
            if (this.direction < 0) {
                this.line.x -= this.speed;
            }
        }
        else if (this.axis == 'y') {
            this.y += this.direction * this.speed;
            this.line.height += this.speed;
            if (this.direction < 0) {
                this.line.y -= this.speed;
            }
        }
        if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
            this.die();
        }
        let box1 = {
            x: this.x - 1,
            y: this.y - 1,
            width: this.width - 1,
            height: this.height - 1
        };
        for (let div of document.querySelectorAll('.linkbox')) {
            let box2 = div.getBoundingClientRect();
            box2.y += linew;
            box2.width -= linew;
            box2.height -= linew * 2;
            if (this.parent.parentElement !== div) {
                if (checkCollision(box1, box2))
                    this.die(box2);
            }
            else {
            }
        }
        for (let lr of lineRunners) {
            if (lr != this && lr.axis != this.axis) {
                let line = lr.line;
                let box2 = {
                    x: line.x - 1,
                    y: line.y - 1,
                    width: line.width - 1,
                    height: line.height - 1
                };
                if (checkCollision(box1, box2))
                    this.die(box2);
            }
        }
    }
    retract() {
        if (this.axis == 'x') {
            this.x -= this.direction * this.speed;
            this.line.width -= this.speed;
            if (this.direction < 0) {
                this.line.x += this.speed;
            }
        }
        else if (this.axis == 'y') {
            this.y -= this.direction * this.speed;
            this.line.height -= this.speed;
            if (this.direction < 0) {
                this.line.y += this.speed;
            }
        }
        if (this.line.width <= 0 || this.line.height <= 0) {
            this.die();
        }
    }
    revive() {
        this.dead = false;
    }
    die(obstacle, nested = false) {
        if (obstacle) {
            let offset = linew / 2;
            if (nested) {
                if (this.direction == 1) {
                    if (this.axis == 'x') {
                        this.line.width = (obstacle.width + obstacle.x) - this.line.startx;
                    }
                    else {
                    }
                }
                else {
                    if (this.axis == 'x') {
                    }
                    else {
                    }
                }
            }
            else {
                if (this.direction == 1) {
                    if (this.axis == 'x') {
                        this.line.width = obstacle.x - this.line.x + offset;
                    }
                    else {
                        this.line.height = Math.ceil(obstacle.y - this.line.y + 1);
                    }
                }
                else {
                    if (this.axis == 'x') {
                        this.line.x = obstacle.x + obstacle.width;
                        this.line.width = this.line.startx - obstacle.x;
                    }
                    else {
                        this.line.y = obstacle.y + obstacle.height;
                        this.line.height = this.line.starty - obstacle.y;
                    }
                }
            }
        }
        this.dead = true;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
//# sourceMappingURL=LineRunner.js.map