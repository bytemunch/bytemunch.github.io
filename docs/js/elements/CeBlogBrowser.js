import { CeMain } from "./CeMain.js";
export class CeBlogBrowser extends CeMain {
    constructor(t, s, b, t1) {
        super(t, s, b, t1);
        const nxt = document.createElement('a');
        nxt.addEventListener('click', this.loadNext.bind(this));
        nxt.textContent = 'next';
        this.shadowRoot.querySelector('#main-title').appendChild(nxt);
        const prv = document.createElement('a');
        prv.addEventListener('click', this.loadPrev.bind(this));
        prv.textContent = 'prev';
        this.shadowRoot.querySelector('#main-title').appendChild(prv);
        this.currentID = 'end';
        this.loadPrev();
    }
    async writeBlog(blogID) {
        const html = await (await fetch(`./posts/${blogID}/index.html`)).text();
        this.shadowRoot.querySelector('#main-content').innerHTML = html;
        this.shadowRoot.querySelector('#main-content').scrollTo({ top: 0 });
        this.currentID = blogID;
    }
    async loadNext() {
        const meta = await (await fetch(`./posts/${this.currentID}/meta.json`)).json();
        if (meta.next)
            this.writeBlog(meta.next);
    }
    async loadPrev() {
        const meta = await (await fetch(`./posts/${this.currentID}/meta.json`)).json();
        if (meta.prev)
            this.writeBlog(meta.prev);
    }
}
customElements.define('ce-blog-browser', CeBlogBrowser);
//# sourceMappingURL=CeBlogBrowser.js.map