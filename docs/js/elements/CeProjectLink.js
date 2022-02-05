import { CustomElement } from "./CustomElement.js";
export class CeProjectLink extends CustomElement {
    constructor(title, description, link, repo, textcolor) {
        super();
        const template = document.querySelector('#project-link-template').content;
        this.attachShadow({ mode: 'open' })
            .appendChild(template.cloneNode(true));
        const t = this.shadowRoot.querySelector('#project-name');
        t.textContent = title;
        const d = this.shadowRoot.querySelector('#description');
        d.textContent = description;
        const l = this.shadowRoot.querySelector('#link');
        l.href = link;
        if (repo) {
            const repoLink = this.shadowRoot.querySelector('#repo');
            repoLink.href = repo;
            repoLink.style.display = 'inline';
        }
        if (textcolor == 'black') {
            this.shadowRoot.querySelector('#link img').src = 'img/link-24px.png';
            this.shadowRoot.querySelector('#repo img').src = 'img/GitHub-Mark-32px.png';
        }
    }
}
customElements.define('ce-project-link', CeProjectLink);
