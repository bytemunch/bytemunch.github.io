import { checkCollision } from "./checkCollision.js";
import { height, linew, width } from "./main.js";
import { getBoundingBoxes } from './getBoundingBoxes.js';
export function findSpace(maxw, minw, maxh, minh) {
    let overlap = true;
    let rw, rh, rx, ry, i = 0;
    while (overlap && i < 1000) {
        i++;
        rw = Math.random() * (maxw - minw) + minw;
        rh = Math.random() * (maxh - minh) + minh;
        rx = Math.floor(Math.random() * (width - rw - linew * 2));
        ry = Math.floor(Math.random() * (height - rh - linew * 2));
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