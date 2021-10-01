import { checkCollision } from "./checkCollision.js";
import { mondrian } from "../main.js";
import { getBoundingBoxes } from './getBoundingBoxes.js';
export function findSpace(maxw, minw, maxh, minh) {
    let overlap = true;
    let rw, rh, rx, ry, i = 0;
    while (overlap && i < 1000) {
        i++;
        rw = Math.random() * (maxw - minw) + minw;
        rh = Math.random() * (maxh - minh) + minh;
        rx = Math.floor(Math.random() * (mondrian.width - rw - mondrian.linew * 2));
        ry = Math.floor(Math.random() * (mondrian.height - rh - mondrian.linew * 2));
        overlap = false;
        let bbs = getBoundingBoxes();
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
//# sourceMappingURL=findSpace.js.map