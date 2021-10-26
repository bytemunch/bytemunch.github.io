import { fadeIn } from './functions/animations.js';
import { Mondrian } from './class/Mondrian.js';
import './elements/CeMain.js';
import { PageHome } from './class/PageHome.js';
import { PagePortfolio } from './class/PagePortfolio.js';
import { PagePlay } from './class/PagePlay.js';
import { PageAbout } from './class/PageAbout.js';
import { PageBlog } from './class/PageBlog.js';
export let mondrian;
export let pages = {
    about: new PageAbout,
    funstuff: new PagePlay,
    portfolio: new PagePortfolio,
    home: new PageHome,
    blog: new PageBlog
};
export let links = [];
await new Promise((res) => {
    document.addEventListener('DOMContentLoaded', () => {
        mondrian = new Mondrian;
        mondrian.resetCanvas();
        res(0);
    });
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
document.addEventListener('DOMContentLoaded', () => { });
//# sourceMappingURL=main.js.map