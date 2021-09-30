import { CustomElement } from "./CustomElement.js";

export class CeMain extends CustomElement {
    constructor(title, subtitle, links?) {
        super();
        //@ts-ignore
        const template = document.querySelector('#main-template').content;

        const shadowRoot = this.attachShadow({ mode: 'open' })
            .appendChild(template.cloneNode(true));

        const spTitle = document.createElement('span');
        spTitle.textContent = title;
        spTitle.setAttribute('slot', 'title');
        const spSubtitle = document.createElement('span');
        spSubtitle.textContent = subtitle;
        spTitle.setAttribute('slot', 'subtitle');

        shadowRoot.appendChild(spTitle);
        shadowRoot.appendChild(spSubtitle);
    }
}

customElements.define('ce-main', CeMain);