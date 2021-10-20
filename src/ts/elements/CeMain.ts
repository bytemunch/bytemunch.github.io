import { CustomElement } from "./CustomElement.js";

export class CeMain extends CustomElement {
    constructor(title, subtitle, background, textcolor) {
        super();
        const template = (<HTMLTemplateElement>document.querySelector('#main-template')).content;

        const shadowRoot = this.attachShadow({ mode: 'open' })
            .appendChild(template.cloneNode(true));

        const t = this.shadowRoot.querySelector('#title');
        t.textContent = title;
        const s = this.shadowRoot.querySelector('#subtitle');
        s.textContent = subtitle;

        (<HTMLElement>this.shadowRoot.querySelector('#main')).style.backgroundColor = background;
        (<HTMLElement>this.shadowRoot.querySelector('#main-content')).style.color = textcolor;
    }

    appendToMain(e:Element) {
        this.shadowRoot.querySelector('#main-content').appendChild(e);
    }

}

customElements.define('ce-main', CeMain);