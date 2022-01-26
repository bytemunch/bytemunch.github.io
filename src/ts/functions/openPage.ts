import {  fadeOut, retractLines } from './animations.js';
import { Page } from '../class/Page.js';
import { pages } from '../main.js';
import { getAnimatableBoxes } from './getAnimatableBoxes.js';
import { wait } from './wait.js';

export async function openPage(page) {
	//grab page object
	page = page.split('&')[0];
	const pg = pages[page.replace('#', '')] as Page;
	let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + location.hash;
	window.history.pushState({ path: newurl }, '', newurl);

	await retractLines();

	const elements = getAnimatableBoxes();

	await fadeOut(elements,0.05);

	// Wait for fade animation to complete fully
	// TODO seems jank, i think it was only off by a frame or something?
	await wait(50);

	// remove old elements from page
	for (let el of elements) {
		el.parentElement.tagName == 'A' ? el.parentElement.parentElement.removeChild(el.parentElement) : el.parentElement.removeChild(el);
	}

	pg.render();

	return;
}