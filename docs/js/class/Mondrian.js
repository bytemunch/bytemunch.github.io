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
        console.log(boxes);
        for (let box of boxes) {
            let bb = box.getBoundingClientRect();
            bb.width -= 2 * this.linew;
            bb.height -= 2 * this.linew;
            this.addRunners(bb, box);
        }
    }
    resetCanvas() {
        console.log('cnvreset');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        console.log(this.canvas);
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.width > this.height ? this.linew = this.height * 0.01 : this.linew = this.width * 0.01;
        this.maxw = (this.width / 4) * this.scale;
        this.maxh = (this.height / 4) * this.scale;
        this.minw = (this.width / 6) * this.scale;
        this.minh = (this.height / 6) * this.scale;
        let oldHeader = document.querySelector('#header');
        if (oldHeader)
            oldHeader.parentElement.removeChild(oldHeader);
        let headerWidth = this.width < this.height ? this.width * 0.7 : this.width * 0.55;
        let headerPos = {
            x: -this.linew * 2,
            y: -this.linew * 2,
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
}
//# sourceMappingURL=Mondrian.js.map