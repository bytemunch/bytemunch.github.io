import { links, mondrian } from "../main.js";
import { newDiv } from '../functions/newDiv.js';
import { fadeIn, drawLines } from "../functions/animations.js";
import { CeMain } from "../elements/CeMain.js";
export class Page {
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
                if (div)
                    document.body.appendChild(div);
            }
            else {
                space = false;
            }
        }
    }
    async animate() {
        var _a;
        const mainDiv = document.querySelector('.main-div');
        const main = (_a = this.main) === null || _a === void 0 ? void 0 : _a.shadowRoot.querySelector('#main');
        const homeLink = document.querySelector('.home');
        let drawBoxes = [...document.querySelectorAll('.linkbox')];
        if (main)
            drawBoxes.push(main);
        if (mainDiv)
            drawBoxes.push(mainDiv);
        if (homeLink)
            drawBoxes.splice(drawBoxes.indexOf(homeLink), 1);
        await fadeIn(drawBoxes, 0.04);
        mondrian.addAllRunners([...drawBoxes, homeLink]);
        await drawLines();
    }
}
//# sourceMappingURL=Page.js.map