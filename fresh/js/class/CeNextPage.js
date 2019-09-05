class CeNextPage extends HTMLDivElement {
    constructor() {
        super();
        this.flipped = false;
    }
    applyStyle() {
    }
    clicked() {
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
            this.flipped = !this.flipped;
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
//# sourceMappingURL=CeNextPage.js.map