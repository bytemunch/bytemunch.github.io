import { CeMain } from "./CeMain.js";

export class CeBlogBrowser extends CeMain {
    currentID;

    constructor(t, s, b, t1, latest=false) {
        super(t, s, b, t1)// can ya tell im tired

        const nxt = document.createElement('a');
        nxt.addEventListener('click', this.loadNext.bind(this));
        nxt.textContent = 'next';
        this.shadowRoot.querySelector('#main-title').appendChild(nxt);

        const prv = document.createElement('a');
        prv.addEventListener('click', this.loadPrev.bind(this));
        prv.textContent = 'prev';
        this.shadowRoot.querySelector('#main-title').appendChild(prv);

        if (latest) {
            this.currentID = 'end';
            this.loadPrev();
        }
    }

    async writeBlog(blogID) {
        const html = await (await fetch(`./posts/${blogID}/index.html`)).text();
        this.shadowRoot.querySelector('#main-content').innerHTML = html;
        this.shadowRoot.querySelector('#main-content').scrollTo({ top: 0 });

        this.currentID = blogID;

        // location.search = 'post='+blogID;

        insertUrlParam('post',blogID);

        // tyty https://stackoverflow.com/a/53929685
        function insertUrlParam(key, value) {
            if (history.pushState) {
                let searchParams = new URLSearchParams(window.location.search);
                searchParams.set(key, value);
                let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString() + location.hash;
                window.history.pushState({path: newurl}, '', newurl);
            }
        }
    }

    async loadNext() {
        // get next from meta
        const meta = await (await fetch(`./posts/${this.currentID}/meta.json`)).json();
        if (meta.next) this.writeBlog(meta.next);
    }

    async loadPrev() {
        const meta = await (await fetch(`./posts/${this.currentID}/meta.json`)).json();
        if (meta.prev) this.writeBlog(meta.prev);
    }
}

customElements.define('ce-blog-browser', CeBlogBrowser);