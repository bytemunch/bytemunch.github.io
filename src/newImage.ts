import { LineRunner } from "./class/LineRunner.js";
import { lineRunners, linew } from "./main.js";

// constructor function WHOOOOOO
export function newImage(x, y, w, h, src, link) {
	let image = document.createElement('img');
	if (src[0] == '.') {
		image.src = src;
		// image.style.backgroundImage = "url('"+src+"')";
		// image.style.backgroundSize = "cover";
	} else {
		image.style.backgroundColor = src;
	}

	image.style.position = 'absolute';
	image.style.left = x;
	image.style.top = y;
	image.style.width = w;
	image.style.height = h;
	image.style.borderStyle = 'solid';
	image.style.borderWidth = linew;
	image.style.zIndex = '1';

	//TL UP
	lineRunners.push(new LineRunner(x, y, 'y', -1));
	//TL L
	lineRunners.push(new LineRunner(x, y, 'x', -1));
	//TR UP
	lineRunners.push(new LineRunner(x + w + linew, y, 'y', -1));
	//TR R
	lineRunners.push(new LineRunner(x + w + linew, y, 'x', 1));
	//BL DOWN
	lineRunners.push(new LineRunner(x, y + h + linew, 'y', 1));
	//BL L
	lineRunners.push(new LineRunner(x, y + h + linew, 'x', -1));
	//BR DOWN
	lineRunners.push(new LineRunner(x + w + linew, y + h + linew, 'y', 1));
	//BR R
	lineRunners.push(new LineRunner(x + w + linew, y + h + linew, 'x', 1));

	return image;
}