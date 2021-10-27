import { mondrian } from "../main.js";

export async function fadeOut(elements, speed) {
	return new Promise(res => {

		if (!elements[0]) { return res(1); } // early return if nothing to fade

		const rafFn = t => {
			let o = parseFloat(elements[0].style.opacity) || 0;
			o -= speed;

			for (let element of elements) {
				element.style.opacity = o;
			}

			if (o > 0) {
				requestAnimationFrame(rafFn);
			} else {
				// remove from page
				// TODO this ugly, shoudn't be in scope of an animation function
				for (let el of elements) {
					el.parentElement.tagName == 'A' ? el.parentElement.parentElement.removeChild(el.parentElement) : el.parentElement.removeChild(el);
				}

				res(0);
			}
		}

		requestAnimationFrame(rafFn);
	});
}

export async function fadeIn(elements, speed) {
	return new Promise(res => {
		let o = 0;

		const rafFn = t => {
			o += speed;

			for (let element of elements) {
				element.style.opacity = o;
			}

			if (o < 1) {
				requestAnimationFrame(rafFn);
			} else {
				res(0);
			}
		}

		requestAnimationFrame(rafFn);
	});
}

export async function drawLines() {
	return new Promise(res => {
		const rafFn = t => {
			mondrian.ctx.clearRect(0, 0, mondrian.width, mondrian.height);
			let live = false;

			for (let lr of mondrian.lineRunners) {
				lr.draw();
				if (!lr.dead) {
					live = true;
					lr.extend();
				}
			}

			if (live) {
				requestAnimationFrame(rafFn);
			} else {
				res(0);
			}
		}

		requestAnimationFrame(rafFn);
	})
}

export async function retractLines() {
	return new Promise(res => {
		mondrian.lineRunners.forEach(lr => lr.revive());

		const rafFn = t => {
			mondrian.ctx.clearRect(0, 0, mondrian.width, mondrian.height);
			let live = false;

			for (let lr of mondrian.lineRunners) {
				lr.retract();
				if (!lr.dead) {
					lr.draw();
					live = true;
				}
			}

			if (live) {
				requestAnimationFrame(rafFn);
			} else {
				mondrian.clearLineRunners();
				res(0);
			}
		}

		requestAnimationFrame(rafFn);
	})
}

export async function fadeBoxesOut() {
	let boxes = Array.from(document.querySelectorAll('.linkbox'));
	const main = document.querySelector('.main-div');
	if (main) boxes.push(main);
	boxes.splice(boxes.indexOf(document.querySelector('.home')), 1);	
	return fadeOut(boxes, 0.05);
}