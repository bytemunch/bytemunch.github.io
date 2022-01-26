import { updateURLParameter } from "../functions/updateURLParameter.js";
export class BlogBrowser extends HTMLElement {
    constructor() {
        super();
        this.currentId = '';
        const sr = this.attachShadow({ mode: 'open' });
        this.db = fetch('./posts/db.json').then(res => res.json());
        this.loaded = fetch('/js/components/BlogBrowser.html').then(res => res.text()).then(html => sr.innerHTML = html);
        const params = new URLSearchParams(window.location.search);
        const bID = params.get('blog');
        const sQ = params.get('query');
        if (bID) {
            this.openBlog(bID);
        }
        else if (sQ) {
            this.search(sQ);
        }
    }
    async init() {
        await this.connectedCallback();
    }
    async applyStyles() {
        var _a;
        const ss = document.createElement('style');
        const ssDone = fetch('/js/components/BlogBrowser.css').then(res => res.text()).then(css => ss.innerHTML = css);
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(ss);
        return ssDone;
    }
    async connectedCallback() {
        var _a, _b, _c, _d, _e, _f;
        await this.loaded;
        await this.applyStyles();
        this.blogDiv = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('#blog-div');
        this.navDiv = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector('#nav-div');
        const searchButton = (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.querySelector('#btn-blog-search');
        const searchInput = (_d = this.shadowRoot) === null || _d === void 0 ? void 0 : _d.querySelector('#blog-search');
        searchButton === null || searchButton === void 0 ? void 0 : searchButton.addEventListener('click', e => {
            e.preventDefault();
            this.search(searchInput.value);
        });
        searchInput.addEventListener('keydown', e => {
            if (e.key == 'Enter') {
                e.preventDefault();
                this.search(searchInput.value);
            }
        });
        const nextButton = (_e = this.shadowRoot) === null || _e === void 0 ? void 0 : _e.querySelector('#btn-blog-next');
        const prevButton = (_f = this.shadowRoot) === null || _f === void 0 ? void 0 : _f.querySelector('#btn-blog-prev');
        nextButton.addEventListener('click', () => this.moveThroughPostsByAmount(1));
        prevButton.addEventListener('click', () => this.moveThroughPostsByAmount(-1));
    }
    async moveThroughPostsByAmount(dist) {
        const orderedIds = await this.orderDbKeysByDate();
        const currentPos = orderedIds.indexOf(this.currentId);
        let targetPos = Math.min(Math.max(currentPos + dist, 0), orderedIds.length - 1);
        this.openBlog(orderedIds[targetPos]);
    }
    async orderDbKeysByDate(reverse = false) {
        const db = await this.db;
        let idArr = Object.keys(db);
        if (reverse) {
            idArr.sort((a, b) => db[b].date - db[a].date);
        }
        else {
            idArr.sort((a, b) => db[a].date - db[b].date);
        }
        return idArr;
    }
    async search(query) {
        await this.loaded;
        window.history.replaceState('', '', updateURLParameter(window.location.href, 'query', query));
        window.history.replaceState('', '', updateURLParameter(window.location.href, 'blog', ''));
        query = query.toLowerCase();
        if (query == '*')
            query = '';
        this.currentId = '';
        const db = await this.db;
        const results = document.createElement('ul');
        let resultArray = [];
        for (let id in db) {
            if (db[id].tags.includes(query) || id.toLowerCase().includes(query) || db[id].title.toLowerCase().includes(query)) {
                resultArray.push(id);
            }
        }
        for (let id of (await this.orderDbKeysByDate(true))) {
            console.log(id);
            if (!resultArray.includes(id))
                continue;
            const result = document.createElement('li');
            const resLink = document.createElement('a');
            resLink.addEventListener('click', e => {
                e.preventDefault();
                this.openBlog(id);
            });
            resLink.href = 'javascript:void(0);';
            resLink.innerText = db[id].title;
            result.appendChild(resLink);
            const dObj = new Date(db[id].date);
            const resDate = document.createElement('span');
            resDate.innerText = dObj.toUTCString();
            result.appendChild(resDate);
            const tagList = document.createElement('ul');
            tagList.innerText = 'tags: ';
            for (let tag of db[id].tags) {
                const tagLi = document.createElement('li');
                const tagLink = this.createTagLink(tag);
                tagLi.appendChild(tagLink);
                tagList.appendChild(tagLi);
            }
            result.appendChild(tagList);
            results.appendChild(result);
        }
        if (resultArray.length > 0) {
            this.blogDiv.innerHTML = `Results for: '${query}'`;
            this.blogDiv.appendChild(results);
        }
        else {
            this.blogDiv.innerHTML = `No results found for: '${query}' Try these tags.`;
            const tagList = document.createElement('ul');
            let tags = {};
            for (let id in db) {
                for (let tag of db[id].tags) {
                    if (!tags[tag])
                        tags[tag] = 0;
                    tags[tag]++;
                }
            }
            let sortedTags = Object.keys(tags);
            sortedTags.sort((a, b) => tags[b] - tags[a]);
            console.log(tags, sortedTags);
            for (let tag of sortedTags) {
                const tagLi = document.createElement('li');
                tagLi.appendChild(this.createTagLink(tag));
                tagList.appendChild(tagLi);
            }
            this.blogDiv.appendChild(tagList);
        }
    }
    createTagLink(tag) {
        const tagLink = document.createElement('a');
        tagLink.href = 'javascript:void(0);';
        tagLink.innerText = tag;
        tagLink.addEventListener('click', e => {
            e.preventDefault();
            this.search(tag);
        });
        return tagLink;
    }
    async openBlog(blogId) {
        window.history.replaceState('', '', updateURLParameter(window.location.href, 'blog', blogId));
        window.history.replaceState('', '', updateURLParameter(window.location.href, 'query', ''));
        this.currentId = blogId;
        await fetch(`/posts/${blogId}.html`).then(res => res.text()).then(html => this.blogDiv.innerHTML = html);
    }
}
customElements.define('nce-blog-browser', BlogBrowser);
//# sourceMappingURL=BlogBrowser.js.map