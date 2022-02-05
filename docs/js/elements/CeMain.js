import { CustomElement } from "./CustomElement.js";
export class CeMain extends CustomElement {
    constructor(title, subtitle, background, textcolor) {
        super();
        const template = document.querySelector('#main-template').content;
        this.attachShadow({ mode: 'open' })
            .appendChild(template.cloneNode(true));
        const t = this.shadowRoot.querySelector('#title');
        t.textContent = title;
        const s = this.shadowRoot.querySelector('#subtitle');
        s.textContent = subtitle;
        this.shadowRoot.querySelector('#main').style.backgroundColor = background;
        this.shadowRoot.querySelector('#main-content').style.color = textcolor;
        this.classList.add('main-div');
    }
    appendToMain(e) {
        this.shadowRoot.querySelector('#main-content').appendChild(e);
    }
    appendToTitle(e) {
        this.shadowRoot.querySelector('#main-title').appendChild(e);
    }
}
customElements.define('ce-main', CeMain);
