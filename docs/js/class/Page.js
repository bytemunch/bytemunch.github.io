import { addAllRunners, links, maxh, maxw, minh, minw } from "../main.js";
import { findSpace } from "../findSpace.js";
import { newDiv } from '../newDiv.js';
import { fadeIn, drawLines } from "../animations.js";
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
        console.log(this.main.shadowRoot.querySelector('.main').getBoundingClientRect());
        this.addNavLinks();
        this.addImages();
        this.addEmptyDivs();
        await this.animate();
    }
    addNavLinks() {
        for (let l of links) {
            if (l.link.replace('#', '') !== this.name) {
                let pos = findSpace(maxw, minw, maxh, minh);
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
                let ipos = findSpace(maxw, minw, maxh, minh);
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
            let pos = findSpace(maxw, minw, maxh, minh);
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
        addAllRunners(drawBoxes, async () => await drawLines());
    }
}
//# sourceMappingURL=Page.js.map