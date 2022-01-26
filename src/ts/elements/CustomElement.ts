export abstract class CustomElement extends HTMLElement {
    ready: Promise<any>;
    readyRes: (val: any) => void;
    constructor() {
        super();
        this.ready = new Promise(res => this.readyRes = res);
    }

    applyStyle() {

    }

    connectedCallback() {
        this.readyRes(0);
    }
}