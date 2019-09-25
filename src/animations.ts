
// animation
function finishedAnimation() {
	// console.log('done thoooooo');
}

function fadeOut(elements, speed, cb) {
	if (!elements[0]) {
		// console.log('no elements, failing through...');
		cb();
	} else {
		let o = parseFloat(elements[0].style.opacity) || 1;
		o -= speed;
		for (let element of elements) {
			element.style.opacity = o;
		}

		if (o > 0) {
			window.requestAnimationFrame(ts => {
				fadeOut(elements, speed, cb);
			});
		} else {
			// remove from page
			for (let el of elements) {
				el.parentElement.tagName == 'A' ?
					el.parentElement.parentElement.removeChild(el.parentElement) :
					el.parentElement.removeChild(el);
			}
			if (cb) cb();
		}
	}
}

function fadeIn(elements, speed, cb?) {
	let o = parseFloat(elements[0].style.opacity) || 0;
	o += speed;

	for (let element of elements) {
		element.style.opacity = o;
	}

	if (o < 1) {
		window.requestAnimationFrame(ts => {
			fadeIn(elements, speed, cb);
		});
	} else {
		if (cb) cb();
	}
}

function drawLines(cb) {
	ctx.clearRect(0, 0, width, height);
	let live = false;

	for (let lr of lineRunners) {
		lr.line.draw();
		if (!lr.dead) {
			live = true;
			lr.update();
			//lr.draw();
		}
	}

	if (live) {
		window.requestAnimationFrame(ts => {
			drawLines(cb);
		});
	} else {
		if (cb) cb();
	}
}

function retractLines(cb) {
	ctx.clearRect(0, 0, width, height);
	let live = false;

	for (let lr of lineRunners) {
		lr.revive();
		lr.retract();
		if (!lr.dead) {
			lr.line.draw();
			live = true;
			//lr.draw();
		}
	}

	if (live) {
		window.requestAnimationFrame(ts => {
			retractLines(cb);
		});
	} else {
		lineRunners = []; //clear array to setup for next page

		if (cb) cb();
	}
}

function fadeBoxesOut(cb) {
	//@ts-ignore
	// "Property 'from' does not exist on type 'ArrayConstructor'." uh yeah it does?
	let boxes = Array.from(document.querySelectorAll('.linkbox'));
	boxes.splice(boxes.indexOf(document.querySelector('.home')), 1);

	fadeOut(boxes, 0.05, cb);
}