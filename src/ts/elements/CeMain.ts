import { CustomElement } from "./CustomElement.js";

export class CeMain extends CustomElement {
    constructor(title:string, subtitle:string, background:string, textcolor:string) {
        super();
        const template = (<HTMLTemplateElement>document.querySelector('#main-template')).content;

        this.attachShadow({ mode: 'open' })
            .appendChild(template.cloneNode(true));

        const t = this.shadowRoot.querySelector('#title');
        t.textContent = title;
        const s = this.shadowRoot.querySelector('#subtitle');
        s.textContent = subtitle;

        (<HTMLElement>this.shadowRoot.querySelector('#main')).style.backgroundColor = background;
        (<HTMLElement>this.shadowRoot.querySelector('#main-content')).style.color = textcolor;

        this.classList.add('main-div');
    }

    appendToMain(e:Element) {
        this.shadowRoot.querySelector('#main-content').appendChild(e);
    }

    appendToTitle(e:Element) {
        this.shadowRoot.querySelector('#main-title').appendChild(e);
    }

}

customElements.define('ce-main', CeMain);