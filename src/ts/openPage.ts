import { fadeBoxesOut, retractLines } from './animations.js';
import { Page } from './class/Page.js';
import { pages } from './main.js';

export async function openPage(page) {
	//grab page object
	const pg = pages[page.replace('#', '')] as Page;

	await retractLines();
	await fadeBoxesOut();
	pg.newRender();

	return;
}