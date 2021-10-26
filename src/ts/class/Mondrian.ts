import { checkCollision } from "../functions/checkCollision.js";
import { newDiv } from "../functions/newDiv.js";
import { openPage } from "../functions/openPage.js";
import { LineRunner } from "./LineRunner.js";

export class Mondrian {
    lineRunners: LineRunner[];
    linew: number;

    width: number;
    height: number;
    maxw: number;
    maxh: number;
    minw: number;
    minh: number;

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    scale: number;

    constructor() {
        this.scale = 1;

        this.canvas = document.querySelector('#mondrian-canvas');

        this.ctx = this.canvas.getContext('2d');

        this.clearLineRunners();
    }

    clearLineRunners() { this.lineRunners = [] }

    addRunners(pos: DOMRect, parent: Element) {
        //x y w h 
        //TL UP
        this.lineRunners.push(new LineRunner(pos.x, pos.y, 'y', -1, parent));
        //TL L
        this.lineRunners.push(new LineRunner(pos.x, pos.y, 'x', -1, parent));
        //TR UP
        this.lineRunners.push(new LineRunner(pos.x + pos.width + this.linew, pos.y, 'y', -1, parent));
        //TR R
        this.lineRunners.push(new LineRunner(pos.x + pos.width + this.linew, pos.y, 'x', 1, parent));
        //BL DOWN
        this.lineRunners.push(new LineRunner(pos.x, pos.y + pos.height + this.linew, 'y', 1, parent));
        //BL L
        this.lineRunners.push(new LineRunner(pos.x, pos.y + pos.height + this.linew, 'x', -1, parent));
        //BR DOWN
        this.lineRunners.push(new LineRunner(pos.x + pos.width + this.linew, pos.y + pos.height + this.linew, 'y', 1, parent));
        //BR R
        this.lineRunners.push(new LineRunner(pos.x + pos.width + this.linew, pos.y + pos.height + this.linew, 'x', 1, parent));
    }

    // add linerunners whole page
    addAllRunners(boxes: Array<Element>) {
        console.log(boxes);

        // boxes = document.querySelectorAll('.linkbox');
        //@ts-ignore
        for (let box of boxes) {
            let bb = box.getBoundingClientRect() as DOMRect;
            //modify to fit
            bb.width -= 2 * this.linew;
            bb.height -= 2 * this.linew;
            this.addRunners(bb, box);
        }
    }

    resetCanvas() {
        console.log('cnvreset', this);

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
        if (oldHeader) oldHeader.parentElement.removeChild(oldHeader);

        // add title
        let headerWidth = this.width < this.height ? this.width * 0.7 : this.width * 0.55;
        let headerPos = {
            x: -this.linew * 2,
            y: -this.linew * 2,
            width: headerWidth,
            height: headerWidth * 0.1
        }
        let header = newDiv(headerPos, './img/home.png', '#home');

        if (header) {
            document.body.appendChild(header);

            //set color
            (<HTMLElement>header.firstChild).style.backgroundColor = 'white';
            //add class
            (<HTMLElement>header.firstChild).classList.add('home');


            header.id = 'header'
            //remove overlay
            header.firstChild.removeChild(header.firstChild.firstChild);
        }

        openPage(location.hash.replace('#', '') || 'home');
    }

    findSpace() {
        let overlap = true;
    
        let rw, rh, rx, ry, i = 0;
        while (overlap && i < 1000) {
            i++;
            // REGULAR SIZING
            // rw = Math.floor(maxw - Math.random() * minw);
            // rh = Math.floor(maxh - Math.random() * minh);
    
            rw = Math.random() * (this.maxw - this.minw) + this.minw;
            rh = Math.random() * (this.maxh - this.minh) + this.minh;
    
            // MINIMUM SIZE TEST
            // rw = minw;
            // rh = minh;
    
            // MAX SIZE TEST
            // rw = maxw;
            // rh = maxh;
    
            // REGULAR POSITIONING
            rx = Math.floor(Math.random() * (this.width - rw - this.linew * 2));
            ry = Math.floor(Math.random() * (this.height - rh - this.linew * 2));
    
            // DISABLE OVERLAP CHECK BEFORE USE!!!
    
            // MIN POSITIONING
            // rx = 0;
            // ry = 0;
    
            // MAX POSITIONING
            // rx = 1 * (width - rw - linew*2);
            // ry = 1 * (height - rh - linew*2);
    
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
    
        if (i >= 1000) {
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
    
    
        //@ts-ignore
        // NodeList is iterable why you say no
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