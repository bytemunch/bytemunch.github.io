export abstract class CustomElement extends HTMLElement {
    ready: Promise<any>;
    readyRes;
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