import { checkCollision } from "./checkCollision.js";
import { mondrian } from "../main.js";
import { getBoundingBoxes } from './getBoundingBoxes.js';

export function findSpace(maxw, minw, maxh, minh) {
	//TODO positioning, collisions, etc should be done serverside
	let overlap = true;

	let rw, rh, rx, ry, i = 0;
	while (overlap && i < 1000) {
		i++;
		// REGULAR SIZING
		// rw = Math.floor(maxw - Math.random() * minw);
		// rh = Math.floor(maxh - Math.random() * minh);

		rw = Math.random() * (maxw - minw) + minw;
		rh = Math.random() * (maxh - minh) + minh;

		// MINIMUM SIZE TEST
		// rw = minw;
		// rh = minh;

		// MAX SIZE TEST
		// rw = maxw;
		// rh = maxh;

		// REGULAR POSITIONING
		rx = Math.floor(Math.random() * (mondrian.width - rw - mondrian.linew * 2));
		ry = Math.floor(Math.random() * (mondrian.height - rh - mondrian.linew * 2));

		// DISABLE OVERLAP CHECK BEFORE USE!!!

		// MIN POSITIONING
		// rx = 0;
		// ry = 0;

		// MAX POSITIONING
		// rx = 1 * (width - rw - linew*2);
		// ry = 1 * (height - rh - linew*2);

		overlap = false;

		let bbs = getBoundingBoxes();
		for (let bb of bbs) {
			let thisBb = { x: rx, y: ry, width: rw, height: rh };
			if (checkCollision(bb, thisBb)) {
				overlap = true;
				break;
			}
		}
	}

	if (i >= 1000) {
		return false;
	}

	return { x: rx, y: ry, width: rw, height: rh };
}