const pageBlockOrder = ['home', 'portfolio', 'contact', 'about'];
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
    if (location.hash) {
        scrollToDiv(location.hash.replace('#', ''), 'auto');
    }
    window.addEventListener('scroll', windowScrolled);
}
document.addEventListener('DOMContentLoaded', loaded);
//# sourceMappingURL=main.js.map