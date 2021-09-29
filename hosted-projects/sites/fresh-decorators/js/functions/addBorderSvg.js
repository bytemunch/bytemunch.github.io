function addBorderSvg(el) {
    el.classList.add('svg-border');
    const svgEl = qn => document.createElementNS("http://www.w3.org/2000/svg", qn);
    const dropPx = style => style.replace('px', '').replace('Px', '').replace('PX', '');
    let svg = svgEl('svg');
    let svgH = "100%";
    let svgW = "100%";
    svg.setAttribute('height', svgH);
    svg.setAttribute('width', svgW);
    svg.classList.add('border');
    let path = svgEl('path');
    let pathWidth = 5;
    let pathColor = "red";
    let fill = "none";
    path.setAttribute('stroke-width', pathWidth);
    path.setAttribute('stroke', pathColor);
    path.setAttribute('fill', fill);
    path.id = 'path' + performance.now().toString().replace('.', '');
    function delayedAnimation() {
        path.classList.add(`delayed-path-animation`);
        svg.removeEventListener('mouseover', delayedAnimation);
    }
    svg.addEventListener('mouseover', delayedAnimation);
    svg.appendChild(path);
    svg.changePath = function changePath(pathD) {
        this.querySelector('path').setAttribute('d', pathD);
    };
    svg.createPath = function createPath(style) {
        let offset = pathWidth / 2;
        let w = dropPx(style.width);
        let h = dropPx(style.height);
        let bw = dropPx(getComputedStyle(el).borderWidth);
        return `M ${-offset + bw}            ${offset + bw}
                l ${w - bw * 2}                  ${0}
                l ${0}                  ${h - (offset * 2) - bw * 2} 
                l ${-w + (offset * 2) + (bw * 2)}     ${0}
                L ${offset}             ${offset + bw + bw}`;
    };
    let svgStyle = svgEl('style');
    svg.appendChild(svgStyle);
    svg.setStyles = function setStyles() {
        let svgStyle = this.querySelector('style');
        let path = this.querySelector('path');
        let lineLength = path.getTotalLength();
        svgStyle.innerHTML = `/* TO BE INLINED IN SVG */

        .border {
            position: absolute;
            top: 0;
            left: 0;
        }

        .border #${path.id} {
            stroke-dasharray: ${lineLength};
            stroke-dashoffset: ${lineLength};
        }
        
        #${path.id}.delayed-path-animation {
            stroke-dasharray: ${lineLength};
            stroke-dashoffset: ${lineLength};
            animation: hideBorder${path.id} 500ms cubic-bezier(0.4, 0.0, 0.2, 1) alternate;
        }
        
        .border:hover #${path.id} {
            stroke-dashoffset: 0;
        
            animation: drawBorder${path.id} 500ms cubic-bezier(0.4, 0.0, 0.2, 1) alternate;
        }
        
        @keyframes drawBorder${path.id} {
            from {
                stroke-dashoffset: ${lineLength};
            } to {
                stroke-dashoffset: 0;
            }
        }
        
        @keyframes hideBorder${path.id} {
            from {
                stroke-dashoffset: 0;
            } to {
                stroke-dashoffset: ${lineLength};
            }
        }`;
    };
    svg.redraw = function redraw(el) {
        svg.changePath(svg.createPath(getComputedStyle(el)));
        svg.setStyles();
    };
    svg.redraw(el);
    el.appendChild(svg);
    return svg;
}
window.addEventListener('resize', () => {
    document.querySelectorAll('.svg-border').forEach(el => {
        el.querySelector('.border').redraw(el);
    });
});
document.addEventListener('DOMContentLoaded', e => {
    document.querySelectorAll('.svg-border').forEach(el => {
        addBorderSvg(el);
    });
});
//# sourceMappingURL=addBorderSvg.js.map