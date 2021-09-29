import { clearLineRunners, ctx, height, lineRunners, width } from "./main.js";
export async function fadeOut(elements, speed) {
    return new Promise(res => {
        if (!elements[0]) {
            console.log('nada');
            return res(1);
        }
        const rafFn = t => {
            let o = parseFloat(elements[0].style.opacity) || 0;
            o -= speed;
            for (let element of elements) {
                element.style.opacity = o;
            }
            if (o > 0) {
                requestAnimationFrame(rafFn);
            }
            else {
                for (let el of elements) {
                    el.parentElement.tagName == 'A' ?
                        el.parentElement.parentElement.removeChild(el.parentElement) :
                        el.parentElement.removeChild(el);
                }
                res(0);
            }
        };
        requestAnimationFrame(rafFn);
    });
}
export async function fadeIn(elements, speed) {
    return new Promise(res => {
        const rafFn = t => {
            let o = parseFloat(elements[0].style.opacity) || 0;
            o += speed;
            for (let element of elements) {
                element.style.opacity = o;
            }
            if (o < 1) {
                requestAnimationFrame(rafFn);
            }
            else {
                res(0);
            }
        };
        requestAnimationFrame(rafFn);
    });
}
export async function drawLines() {
    return new Promise(res => {
        const rafFn = t => {
            ctx.clearRect(0, 0, width, height);
            let live = false;
            for (let lr of lineRunners) {
                lr.line.draw();
                if (!lr.dead) {
                    live = true;
                    lr.extend();
                }
            }
            if (live) {
                requestAnimationFrame(rafFn);
            }
            else {
                res(0);
            }
        };
        requestAnimationFrame(rafFn);
    });
}
export async function retractLines() {
    return new Promise(res => {
        lineRunners.forEach(lr => lr.revive());
        const rafFn = t => {
            ctx.clearRect(0, 0, width, height);
            let live = false;
            for (let lr of lineRunners) {
                lr.retract();
                if (!lr.dead) {
                    lr.line.draw();
                    live = true;
                }
            }
            if (live) {
                requestAnimationFrame(rafFn);
            }
            else {
                clearLineRunners();
                res(0);
            }
        };
        requestAnimationFrame(rafFn);
    });
}
export async function fadeBoxesOut() {
    let boxes = Array.from(document.querySelectorAll('.linkbox'));
    boxes.splice(boxes.indexOf(document.querySelector('.home')), 1);
    return fadeOut(boxes, 0.05);
}
//# sourceMappingURL=animations.js.map