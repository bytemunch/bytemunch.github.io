import { fadeBoxesOut, retractLines } from './animations.js';
import { Page } from '../class/Page.js';
import { pages } from '../main.js';

export async function openPage(page) {
	//grab page object
	const pg = pages[page.replace('#', '')] as Page;
	if (page !== 'blog') {
		let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + location.hash;
		window.history.pushState({path: newurl}, '', newurl);
	}

	await retractLines();
	await fadeBoxesOut();
	pg.render();
	
	return;
}