import { Page } from './class/Page.js';
import { fadeIn } from './functions/animations.js';
import { Mondrian } from './class/Mondrian.js';

// Elements
import './elements/CeMain.js';
import { PageHome } from './class/PageHome.js';
import { PagePortfolio } from './class/PagePortfolio.js';
import { PagePlay } from './class/PagePlay.js';
import { PageAbout } from './class/PageAbout.js';

interface Link {
	img: string,
	link: string,
	txt: string
}

export let mondrian;

export let pages = {
	about: new PageAbout,
	funstuff: new PagePlay,
	portfolio: new PagePortfolio,
	home: new PageHome
};

export let links: Link[] = [];

await new Promise((res) => {
	document.addEventListener('DOMContentLoaded', () => {
		mondrian = new Mondrian;
		mondrian.resetCanvas();
		res(0);
	});
});

//data structures

export async function getPage(page) {
	const res = await fetch('./pages/' + page + '.json')
	return res.json();
}

export function reRange(val, min1, max1, min2, max2) {
	let percent = (val - min1) / (max1 - min1);

	let newVal = min2 + ((max2 - min2) * percent);

	return newVal;
}

links.push({ img: "./img/about.png", link: "#about", txt: "me" });
links.push({ img: "./img/work.png", link: "#portfolio", txt: "work" });
links.push({ img: "./img/play.png", link: "#funstuff", txt: "play" });

setTimeout(() => {
	fadeIn([document.body], 0.05);
}, 150);

window.addEventListener('resize', mondrian.resetCanvas);
document.addEventListener('DOMContentLoaded', () => { });