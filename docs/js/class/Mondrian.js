import { checkCollision } from "../functions/checkCollision.js";
import { newDiv } from "../functions/newDiv.js";
import { openPage } from "../functions/openPage.js";
import { LineRunner } from "./LineRunner.js";
export class Mondrian {
    constructor() {
        this.scale = 1;
        this.canvas = document.querySelector('#mondrian-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.clearLineRunners();
    }
    clearLineRunners() { this.lineRunners = []; }
    addRunners(pos, parent) {
        this.lineRunners.push(new LineRunner(pos.x, pos.y, 'y', -1, parent));
        this.lineRunners.push(new LineRunner(pos.x, pos.y, 'x', -1, parent));
        this.lineRunners.push(new LineRunner(pos.x + pos.width + this.linew, pos.y, 'y', -1, parent));
        this.lineRunners.push(new LineRunner(pos.x + pos.width + this.linew, pos.y, 'x', 1, parent));
        this.lineRunners.push(new LineRunner(pos.x, pos.y + pos.height + this.linew, 'y', 1, parent));
        this.lineRunners.push(new LineRunner(pos.x, pos.y + pos.height + this.linew, 'x', -1, parent));
        this.lineRunners.push(new LineRunner(pos.x + pos.width + this.linew, pos.y + pos.height + this.linew, 'y', 1, parent));
        this.lineRunners.push(new LineRunner(pos.x + pos.width + this.linew, pos.y + pos.height + this.linew, 'x', 1, parent));
    }
    addAllRunners(boxes) {
        for (let box of boxes) {
            let bb = box.getBoundingClientRect();
            bb.width -= 2 * this.linew;
            bb.height -= 2 * this.linew;
            this.addRunners(bb, box);
        }
    }
    resetCanvas() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.width > this.height ? this.linew = this.height * 0.01 : this.linew = this.width * 0.01;
        this.maxw = (this.width / 5) * this.scale;
        this.maxh = (this.height / 5) * this.scale;
        this.minw = (this.width / 6) * this.scale;
        this.minh = (this.height / 6) * this.scale;
        let oldHeader = document.querySelector('#header');
        if (oldHeader)
            oldHeader.parentElement.removeChild(oldHeader);
        let headerPos = {
            x: -this.linew * 2,
            y: -this.linew * 2,
            width: 0,
            height: 0
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
    findSpace() {
        let overlap = true;
        let maxTriesToPlace = 10000;
        let rw, rh, rx, ry, i = 0;
        while (overlap && i < maxTriesToPlace) {
            i++;
            rw = Math.random() * (this.maxw - this.minw) + this.minw;
            rh = Math.random() * (this.maxh - this.minh) + this.minh;
            rx = Math.floor(Math.random() * (this.width - rw - this.linew * 2));
            ry = Math.floor(Math.random() * (this.height - rh - this.linew * 2));
            overlap = false;
            let bbs = this.getBoundingBoxes();
            for (let bb of bbs) {
                let thisBb = { x: rx, y: ry, width: rw, height: rh };
                if (checkCollision(bb, thisBb)) {
                    overlap = true;
                    break;
                }
            }
        }
        if (i >= maxTriesToPlace) {
            return false;
        }
        return { x: rx, y: ry, width: rw, height: rh };
    }
    getBoundingBoxes() {
        let divs = Array.from(document.querySelectorAll('.linkbox'));
        let shadowRootElements = document.querySelectorAll('.main-div');
        if (shadowRootElements[0]) {
            shadowRootElements.forEach(el => divs.push(el.shadowRoot.querySelector('#main')));
        }
        let bbs = [];
        let divbb;
        for (let div of divs) {
            divbb = div.getBoundingClientRect();
            let stripped = {
                x: divbb.x -= this.linew,
                y: divbb.y -= this.linew,
                width: divbb.width += this.linew,
                height: divbb.height += this.linew
            };
            bbs.push(stripped);
        }
        return bbs;
    }
}
//# sourceMappingURL=Mondrian.js.map