import { links, mondrian } from "../main.js";
import { findSpace } from "../functions/findSpace.js";
import { newDiv } from '../functions/newDiv.js';
import { fadeIn, drawLines } from "../functions/animations.js";
import { CeMain } from "../elements/CeMain.js";
export class Page {
    constructor(name) {
        this.name = name;
        this.complexity = 4;
    }
    async newRender() {
        this.main = new CeMain('this is a title', 'this is a subtitle');
        document.body.appendChild(this.main);
        await this.main.ready;
        this.addNavLinks();
        this.addImages();
        this.addEmptyDivs();
        await this.animate();
    }
    addNavLinks() {
        for (let l of links) {
            if (l.link.replace('#', '') !== this.name) {
                let pos = findSpace(mondrian.maxw, mondrian.minw, mondrian.maxh, mondrian.minh);
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
                let ipos = findSpace(mondrian.maxw, mondrian.minw, mondrian.maxh, mondrian.minh);
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
            let pos = findSpace(mondrian.maxw, mondrian.minw, mondrian.maxh, mondrian.minh);
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
        let drawBoxes = [...document.querySelectorAll('.linkbox'), this.main.shadowRoot.querySelector('.main')];
        await fadeIn(drawBoxes, 0.05);
        mondrian.addAllRunners(drawBoxes);
        await drawLines();
    }
}
//# sourceMappingURL=Page.js.map