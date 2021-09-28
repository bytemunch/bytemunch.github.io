import { fadeBoxesOut, retractLines } from './animations.js';
import { pages } from './main.js';

export function openPage(page) {
	//grab page object
	page = pages[page.replace('#', '')];

	retractLines(() => {
		fadeBoxesOut(() => {
			page.render();
		});
	});//TODO async/await
}