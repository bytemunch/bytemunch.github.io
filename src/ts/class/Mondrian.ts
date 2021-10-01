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
}