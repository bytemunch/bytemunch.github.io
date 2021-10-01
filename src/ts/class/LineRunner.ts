import { mondrian } from "../main.js";
import { checkCollision } from "../functions/checkCollision.js";
import { getBoundingBoxes } from "../functions/getBoundingBoxes.js";

interface Line {
	x: number,
	y: number,
	startx: number,
	starty: number,
	width: number,
	height: number
}

export class LineRunner {
	x;
	y;
	width;
	height;
	axis;
	direction;
	speed;
	dead;
	color;
	parent;
	line:Line;

	constructor(x, y, axis, direction, parent?) {
		this.x = x;
		this.y = y;
		this.width = mondrian.linew;
		this.height = mondrian.linew;
		this.axis = axis;
		this.direction = direction;
		this.speed = mondrian.linew * 2;
		this.dead = false;
		this.color = "#000000";
		this.parent = parent;

		this.line = {
			x, y, height: mondrian.linew, width: mondrian.linew, startx: x, starty: y
		}
	}

	extend() {
		if (this.axis == 'x') {
			this.x += this.direction * this.speed;
			this.line.width += this.speed;

			if (this.direction < 0) {
				this.line.x -= this.speed;
				
			}
		} else if (this.axis == 'y') {
			this.y += this.direction * this.speed;

			this.line.height += this.speed;

			if (this.direction < 0) {
				this.line.y -= this.speed;
			}
		}

		if (this.x > mondrian.width || this.x < 0 || this.y > mondrian.height || this.y < 0) {
			this.die();
		}

		let box1 = {
			x: this.x - 1,
			y: this.y - 1,
			width: this.width - 1,
			height: this.height - 1
		};

		for (let bb of getBoundingBoxes()) {
			let box2 = bb;
			box2.y += mondrian.linew;
			box2.width -= mondrian.linew;
			box2.height -= mondrian.linew * 2;
			box2.x += mondrian.linew;
			// if (this.parent.parentElement !== bb) { //allows nesting
				if (checkCollision(box1, box2)) this.die(box2);
			// } else {
			// 	//if (!checkCollision(box1, box2)) this.die(box2, true);
			// }
		}


		for (let lr of mondrian.lineRunners) {
			if (lr != this && lr.axis != this.axis) {
				let line = lr.line;

				let box2 = {
					x: line.x - 1,
					y: line.y - 1,
					width: line.width - 1,
					height: line.height - 1
				};

				if (checkCollision(box1, box2)) this.die(box2);
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

		} else if (this.axis == 'y') {
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

	die(obstacle?, nested = false) {
		if (obstacle) {
			// trim line to fit
			let offset = mondrian.linew / 2;

			if (nested) {
				if (this.direction == 1) {
					if (this.axis == 'x') {
						// this.line.width = obstacle.width - this.line.x + offset;
						this.line.width = (obstacle.width + obstacle.x) - this.line.startx;
					} else {
						// this.line.height = obstacle.y - this.line.y + offset;
					}
				} else {
					if (this.axis == 'x') {
						// this.line.x = obstacle.x + offset;
						// this.line.width = this.line.startx - obstacle.x;//+ 2*offset;
					} else {
						// this.line.y = obstacle.y + offset;
						// this.line.height = this.line.starty - obstacle.y; //+ 2*offset;
					}
				}
			} else {
				if (this.direction == 1) {
					if (this.axis == 'x') {
						this.line.width = obstacle.x - this.line.x + offset;
					} else {
						this.line.height = Math.ceil(obstacle.y - this.line.y + 1);// + offset/4;
					}
				} else {
					if (this.axis == 'x') {
						this.line.x = obstacle.x + obstacle.width;
						this.line.width = this.line.startx - obstacle.x;//+ 2*offset;
					} else {
						this.line.y = obstacle.y + obstacle.height;
						this.line.height = this.line.starty - obstacle.y; //+ 2*offset;
					}
				}
			}
		}

		this.dead = true;
	}

	draw() {
		mondrian.ctx.fillStyle = this.color;
		mondrian.ctx.fillRect(this.line.x, this.line.y, this.line.width, this.line.height);
	}
}