class CeNavList extends HTMLDivElement {
    constructor() {
        super();
        this.isOpen = false;
    }
    toggleState() {
        if (window.innerWidth < 768)
            this.isOpen ? this.close() : this.open();
    }
    open() {
        this.isOpen = true;
        this.style.visibility = 'visible';
    }
    close() {
        this.isOpen = false;
        this.style.visibility = 'hidden';
    }
    connectedCallback() {
    }
}
customElements.define('ce-nav-list', CeNavList, { extends: 'div' });
//# sourceMappingURL=CeNavList.js.map