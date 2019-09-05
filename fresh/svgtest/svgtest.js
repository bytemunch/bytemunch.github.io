function addBorderSvg(el) {
    const svgEl = qn => document.createElementNS("http://www.w3.org/2000/svg", qn);
    let svg = svgEl('svg');
    let svgH = "100%";
    let svgW = "100%";
    svg.setAttribute('height', svgH);
    svg.setAttribute('width', svgW);
    svg.classList.add('border');
    let path = svgEl('path');
    let pathWidth = 3;
    let pathColor = "red";
    let fill = "none";
    path.setAttribute('stroke-width', pathWidth);
    path.setAttribute('stroke', pathColor);
    path.setAttribute('fill', fill);
    function delayedAnimation() {
        path.classList.add('delayed-path-animation');
        svg.removeEventListener('mouseover', delayedAnimation);
    }
    svg.addEventListener('mouseover', delayedAnimation);
    svg.appendChild(path);
    svg.changePath = function changePath(pathD) {
        this.querySelector('path').setAttribute('d', pathD);
    };
    svg.createPath = function createPath(bb) {
        let offset = pathWidth / 2;
        return `M ${-offset} ${offset} L ${bb.width - offset * 2} ${offset} L ${bb.width - offset * 2} ${bb.height - offset * 2} L ${offset} ${bb.height - offset * 2} L ${offset} ${offset}`;
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

        .border path {
            stroke-dasharray: ${lineLength};
            stroke-dashoffset: ${lineLength};
        }
        
        .delayed-path-animation {
            stroke-dasharray: ${lineLength};
            stroke-dashoffset: ${lineLength};
            animation: hideBorder 500ms cubic-bezier(0.4, 0.0, 0.2, 1) alternate;
        }
        
        .border:hover path {
            stroke-dashoffset: 0;
        
            animation: drawBorder 500ms cubic-bezier(0.4, 0.0, 0.2, 1) alternate;
            /*animation: fadeIn 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) alternate;*/
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            } to {
                opacity: 1;
            }
        }
        
        @keyframes drawBorder {
            from {
                stroke-dashoffset: ${lineLength};
            } to {
                stroke-dashoffset: 0;
            }
        }
        
        @keyframes hideBorder {
            from {
                stroke-dashoffset: 0;
            } to {
                stroke-dashoffset: ${lineLength};
            }
        }`;
    };
    svg.redraw = function redraw(el) {
        svg.changePath(svg.createPath(el.getBoundingClientRect()));
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
//# sourceMappingURL=svgtest.js.map