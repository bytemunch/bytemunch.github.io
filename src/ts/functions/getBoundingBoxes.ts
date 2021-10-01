import { linew } from "../main.js";

export function getBoundingBoxes() {
	let divs = Array.from(document.querySelectorAll('.linkbox'));

	let shadowRootElements = document.querySelectorAll('ce-main');

	if (shadowRootElements[0]) {
		shadowRootElements.forEach(el => divs.push(el.shadowRoot.querySelector('.main')));
	}

	let bbs = [];
	let divbb;


	//@ts-ignore
	// NodeList is iterable why you say no
	for (let div of divs) {
		divbb = div.getBoundingClientRect();
		let stripped = {
			x: divbb.x -= linew,
			y: divbb.y -= linew,
			width: divbb.width += linew,
			height: divbb.height += linew
		};
		bbs.push(stripped);
	}

	return bbs;
}