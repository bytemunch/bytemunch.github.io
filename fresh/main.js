// globals
const pageBlockOrder = ['home', 'portfolio', 'contact', 'about'];
// Custom elements
class CeNextPage extends HTMLDivElement {
    constructor() {
        super();
        this.flipped = false;
    }
    applyStyle() {
        // set background to arrow
        // set position absolute bottom
        // zindex 10
        // set width and height
        // do all this in CSS
    }
    clicked() {
        // get current page by hash
        // if not flipped
        //      go to next page
        // else go to home
        if (!this.flipped) {
            let current = getCurrentDiv().id.replace('page-', '');
            let cIdx = pageBlockOrder.indexOf(current);
            let next = pageBlockOrder[cIdx + 1];
            scrollToDiv(next);
        }
        else {
            scrollToDiv('home');
            this.flip();
        }
    }
    flip(dir) {
        if (!dir) {
            // invert this.flipped
            this.flipped = !this.flipped;
            // rotate image 180deg if flipped
            this.flipped ? this.style.transform = 'translateX(-50%) rotate(180deg)' : this.style.transform = 'translateX(-50%) rotate(0deg)';
        }
        else if (dir == 'up') {
            this.flipped = true;
            this.style.transform = 'translateX(-50%) rotate(180deg)';
        }
        else {
            this.flipped = false;
            this.style.transform = 'translateX(-50%) rotate(0deg)';
        }
    }
    connectedCallback() {
        this.addEventListener('click', this.clicked);
        this.id = 'next-page';
        this.applyStyle();
    }
}
customElements.define('ce-next-page', CeNextPage, { extends: 'div' });
class CeNavList extends HTMLUListElement {
    constructor() {
        super();
        this.isOpen = false;
    }
    toggleState() {
        this.isOpen ? this.close() : this.open();
    }
    open() {
        this.isOpen = true;
        this.style.display = 'block';
    }
    close() {
        this.isOpen = false;
        this.style.display = 'none';
    }
    connectedCallback() {
    }
}
customElements.define('ce-nav-list', CeNavList, { extends: 'ul' });
function getCurrentDiv() {
    let divs = document.querySelectorAll('.page-block');
    let possibleDivs = [];
    for (let d of divs) {
        let bb = d.getBoundingClientRect();
        if (bb.top <= 64)
            possibleDivs.push(d);
    }
    return possibleDivs[possibleDivs.length - 1];
}
function lowestPage(page) {
    let cIdx = pageBlockOrder.indexOf(page);
    return cIdx >= pageBlockOrder.length - 1;
}
function windowScrolled(scrollEvent) {
    let currentPage = getCurrentDiv().id.replace('page-', '');
    location.hash = currentPage;
    let flipDir = (lowestPage(currentPage)) ? 'up' : 'down';
    document.querySelector('#next-page').flip(flipDir);
}
function scrollToDiv(div, scrollType = 'smooth') {
    document.querySelector(`#page-${div}`).scrollIntoView({ behavior: scrollType, block: 'end' });
}
function loaded() {
    // define page-block boundaries
    // some howwwww
    // check hash and scroll to it
    if (location.hash) {
        scrollToDiv(location.hash.replace('#', ''), 'auto');
    }
    // add listener to determine hash
    window.addEventListener('scroll', windowScrolled);
}
document.addEventListener('DOMContentLoaded', loaded);
