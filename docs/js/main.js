import { fadeIn } from './functions/animations.js';
import { Mondrian } from './class/Mondrian.js';
import './elements/CeMain.js';
import { PageHome } from './class/PageHome.js';
import { PagePortfolio } from './class/PagePortfolio.js';
import { PagePlay } from './class/PagePlay.js';
import { PageAbout } from './class/PageAbout.js';
import { PageBlog } from './class/PageBlog.js';
import { openPage } from './functions/openPage.js';
export let mondrian;
export let pages = {
    about: new PageAbout,
    funstuff: new PagePlay,
    portfolio: new PagePortfolio,
    home: new PageHome,
    blog: new PageBlog
};
export let links = [];
document.addEventListener('DOMContentLoaded', () => {
    mondrian = new Mondrian;
    mondrian.resetCanvas();
});
export async function getPage(page) {
    const res = await fetch('./pages/' + page + '.json');
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
links.push({ img: "./img/blog.png", link: "#blog", txt: "blog" });
setTimeout(() => {
    fadeIn([document.body], 0.05);
}, 150);
let resizeDebounceTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeDebounceTimeout);
    resizeDebounceTimeout = setTimeout(() => {
        mondrian.resetCanvas();
    }, 300);
});
let oldHash;
window.addEventListener('hashchange', e => {
    if (location.hash == oldHash)
        return;
    openPage(location.hash);
    oldHash = location.hash;
});
