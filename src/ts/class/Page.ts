import { links, mondrian } from "../main.js";
import { newDiv } from '../functions/newDiv.js';
import { fadeIn, drawLines } from "../functions/animations.js";
import { CeMain } from "../elements/CeMain.js";

export abstract class Page {
	name;
	complexity;
	main: CeMain;
	images;

	constructor() {
		this.complexity = 4;
	}

	async render() {
		await this.addMain();

		this.addNavLinks();

		this.addImages();

		this.addEmptyDivs();

		await this.animate();
	}

	async addMain() {
		this.main = new CeMain('this is a title', 'this is a subtitle', 'white', 'black');
		document.body.appendChild(this.main);

		await this.main.ready;
	}

	addNavLinks() {
		for (let l of links) {
			if (l.link.replace('#', '') !== this.name) {
				let pos = mondrian.findSpace();
				let div = newDiv(pos, l.img, l.link, l.txt);
				if (div) {
					document.body.appendChild(div);
				}
			}
		}
	}

	addImages() {
		if (this.images !== 'empty') {
			for (let i in this.images) {
				let ipos = mondrian.findSpace();
				let image = newDiv(ipos, this.images[i]);
				if (image) {
					document.body.appendChild(image);
				}
			}
		}
	}

	addEmptyDivs() {
		let space = true;
		let i = 0;

		while (space && i < this.complexity) {
			i++;
			let pos = mondrian.findSpace();
			if (pos) {
				let div = newDiv(pos);
				if (div) document.body.appendChild(div);
			} else {
				space = false;
			}
		}
	}

	async animate() {
		const mainDiv = this.main?.shadowRoot.querySelector('#main');
		let drawBoxes = [...document.querySelectorAll('.linkbox')];
		if (mainDiv) drawBoxes.push(mainDiv);

		await fadeIn(drawBoxes, 0.05);
		
		mondrian.addAllRunners(drawBoxes);
		await drawLines();
	}
}