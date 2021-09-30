export class CustomElement extends HTMLElement {
    constructor() {
        super();
        this.ready = new Promise(res => this.readyRes = res);
    }
    applyStyle() {
    }
    connectedCallback() {
        this.readyRes();
    }
}
//# sourceMappingURL=CustomElement.js.map