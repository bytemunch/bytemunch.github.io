class borderSvg extends SVGElement {
    constructor() {
        super();
    }
    connectedCallback() {
        console.log('connected custom SVG');
    }
}
customElements.define('border-svg', borderSvg, { extends: 'svg' });
function createSvg(bb) {
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
    svg.appendChild(path);
    svg.changePath = function changePath(pathD) {
        this.querySelector('path').setAttribute('d', pathD);
    };
    svg.createPath = function createPath(bb) {
        let offset = pathWidth / 2;
        return `M ${offset} ${offset} L ${bb.width - offset * 2} ${offset} L ${bb.width - offset * 2} ${bb.height - offset * 2} L ${offset} ${bb.height - offset * 2} L ${offset} ${offset}`;
    };
    if (bb)
        svg.changePath(svg.createPath(bb));
    let svgStyle = svgEl('style');
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
            animation: hideBorder 0.8s ease-in-out alternate;
        }
        
        .border:hover path {
            stroke-dashoffset: 0;
        
            /* animation: drawBorder 0.8s ease-in-out alternate; */
            animation: fadeIn 0.4s ease-in alternate;
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
    svg.setStyle();
    svg.appendChild(svgStyle);
    return svg;
}
document.addEventListener('DOMContentLoaded', e => {
    document.querySelectorAll('.test').forEach(el => {
        let svg = createSvg(el.getBoundingClientRect());
        el.appendChild(svg);
    });
});
//# sourceMappingURL=svgtest.js.map