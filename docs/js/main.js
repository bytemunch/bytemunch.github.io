import { Page } from './class/Page.js';
import { LineRunner } from './class/LineRunner.js';
import { fadeIn } from './functions/animations.js';
import { openPage } from './functions/openPage.js';
import { newDiv } from './functions/newDiv.js';
import './elements/CeMain.js';
let frameCount = 0;
const frameRate = 30;
const rooturi = window.location.hostname;
const canvas = document.createElement('canvas');
canvas.style.position = 'absolute';
canvas.style.zIndex = '0';
export let ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
export let links = [];
export let lineRunners = [];
export const clearLineRunners = () => { lineRunners = []; };
export async function getPage(page) {
    const res = await fetch('./pages/' + page + '.json');
    return res.json();
}
export function reRange(val, min1, max1, min2, max2) {
    let percent = (val - min1) / (max1 - min1);
    let newVal = min2 + ((max2 - min2) * percent);
    return newVal;
}
export let pages = {
    about: new Page('about'),
    funstuff: new Page('funstuff'),
    portfolio: new Page('portfolio'),
    home: new Page('home')
};
links.push({ img: "./img/about.png", link: "#about", txt: "me" });
links.push({ img: "./img/work.png", link: "#portfolio", txt: "work" });
links.push({ img: "./img/play.png", link: "#funstuff", txt: "play" });
const scale = 1;
export let width;
export let height;
export let linew;
export let maxw;
export let maxh;
export let minw;
export let minh;
let drawLoopId;
export function addAllRunners(boxes, cb) {
    console.log(boxes);
    for (let box of boxes) {
        let bb = box.getBoundingClientRect();
        bb.width -= 2 * linew;
        bb.height -= 2 * linew;
        addRunners(bb, box);
    }
    if (cb)
        cb();
}
function addRunners(pos, parent) {
    lineRunners.push(new LineRunner(pos.x, pos.y, 'y', -1, parent));
    lineRunners.push(new LineRunner(pos.x, pos.y, 'x', -1, parent));
    lineRunners.push(new LineRunner(pos.x + pos.width + linew, pos.y, 'y', -1, parent));
    lineRunners.push(new LineRunner(pos.x + pos.width + linew, pos.y, 'x', 1, parent));
    lineRunners.push(new LineRunner(pos.x, pos.y + pos.height + linew, 'y', 1, parent));
    lineRunners.push(new LineRunner(pos.x, pos.y + pos.height + linew, 'x', -1, parent));
    lineRunners.push(new LineRunner(pos.x + pos.width + linew, pos.y + pos.height + linew, 'y', 1, parent));
    lineRunners.push(new LineRunner(pos.x + pos.width + linew, pos.y + pos.height + linew, 'x', 1, parent));
}
setTimeout(() => {
    fadeIn([document.body], 0.05);
}, 150);
function resetCanvas() {
    console.log('cnvreset');
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.height = height;
    canvas.width = width;
    width > height ? linew = height * 0.01 : linew = width * 0.01;
    maxw = (width / 4) * scale;
    maxh = (height / 4) * scale;
    minw = (width / 6) * scale;
    minh = (height / 6) * scale;
    let oldHeader = document.querySelector('#header');
    if (oldHeader)
        oldHeader.parentElement.removeChild(oldHeader);
    let headerWidth = width < height ? width * 0.7 : width * 0.55;
    let headerPos = {
        x: -linew * 2,
        y: -linew * 2,
        width: headerWidth,
        height: headerWidth * 0.1
    };
    let header = newDiv(headerPos, './img/home.png', '#home');
    if (header) {
        document.body.appendChild(header);
        header.firstChild.style.backgroundColor = 'white';
        header.firstChild.classList.add('home');
        header.id = 'header';
        header.firstChild.removeChild(header.firstChild.firstChild);
    }
    openPage(location.hash.replace('#', '') || 'home');
}
window.addEventListener('resize', resetCanvas);
document.addEventListener('DOMContentLoaded', resetCanvas);
//# sourceMappingURL=main.js.map