import { CeMain } from "../elements/CeMain.js";
import { updateURLParameter } from "../functions/updateURLParameter.js";

export class BlogBrowser extends HTMLElement {
    db: Promise<BlogDatabase>;
    loaded: Promise<any>;

    blogDiv!: HTMLDivElement;
    navDiv!: HTMLDivElement;

    currentId = '';

    constructor() {
        super();

        const sr = this.attachShadow({ mode: 'open' });

        this.db = fetch('./posts/db.json').then(res => res.json());

        this.loaded = fetch('/js/components/BlogBrowser.html').then(res => res.text()).then(html => sr.innerHTML = html);

        // permlinks
        const params = new URLSearchParams(window.location.search);
        const bID = params.get('blog');
        const sQ = params.get('query');

        if (bID) {
            this.openBlog(bID);
        } else if (sQ) {
            this.search(sQ);
        }
    }

    async init() {
        await this.connectedCallback();
    }

    async applyStyles() {
        const ss = document.createElement('style');
        const ssDone = fetch('/js/components/BlogBrowser.css').then(res => res.text()).then(css => ss.innerHTML = css);

        this.shadowRoot?.appendChild(ss);

        return ssDone;
    }

    async connectedCallback() {
        await this.loaded;
        await this.applyStyles();
        this.blogDiv = this.shadowRoot?.querySelector('#blog-div') as HTMLDivElement;

        this.navDiv = this.shadowRoot?.querySelector('#nav-div') as HTMLDivElement;

        const searchButton = this.shadowRoot?.querySelector('#btn-blog-search') as HTMLButtonElement;
        const searchInput = this.shadowRoot?.querySelector('#blog-search') as HTMLInputElement;

        searchButton?.addEventListener('click', e => {
            e.preventDefault();
            this.search(searchInput.value);
        });

        searchInput.addEventListener('keydown', e => {
            if (e.key == 'Enter') {
                e.preventDefault();
                this.search(searchInput.value);
            }
        });

        const nextButton = this.shadowRoot?.querySelector('#btn-blog-next') as HTMLButtonElement;
        const prevButton = this.shadowRoot?.querySelector('#btn-blog-prev') as HTMLButtonElement;

        nextButton.addEventListener('click', () => this.moveThroughPostsByAmount(1));
        prevButton.addEventListener('click', () => this.moveThroughPostsByAmount(-1));
    }

    async moveThroughPostsByAmount(dist: number) {
        const orderedIds = await this.orderDbKeysByDate();

        const currentPos = orderedIds.indexOf(this.currentId);

        let targetPos = Math.min(Math.max(currentPos + dist, 0), orderedIds.length - 1);

        this.openBlog(orderedIds[targetPos])
    }

    async orderDbKeysByDate(reverse = false) {
        const db = await this.db;

        let idArr = Object.keys(db);

        if (reverse) {
            idArr.sort((a, b) => db[b].date - db[a].date);
        } else {
            idArr.sort((a, b) => db[a].date - db[b].date);
        }

        return idArr;
    }

    async search(query: string) {
        await this.loaded;

        window.history.replaceState('', '', updateURLParameter(window.location.href, 'query', query));
        window.history.replaceState('', '', updateURLParameter(window.location.href, 'blog', ''));

        query = query.toLowerCase();

        if (query == '*') query = '';

        this.currentId = '';

        const db = await this.db;

        const results = document.createElement('ul');

        let resultArray: string[] = [];

        for (let id in db) {
            if (db[id].tags.includes(query) || id.toLowerCase().includes(query) || db[id].title.toLowerCase().includes(query)) {
                resultArray.push(id);
            }
        }

        // order results by date
        for (let id of (await this.orderDbKeysByDate(true))) {
            if (!resultArray.includes(id)) continue;

            const result = document.createElement('li');

            // add link
            const resLink = document.createElement('a');
            resLink.addEventListener('click', e => {
                e.preventDefault();
                this.openBlog(id);
            });
            resLink.href = 'javascript:void(0);'
            resLink.innerText = db[id].title;
            result.appendChild(resLink);

            // add date
            const dObj = new Date(db[id].date);

            const resDate = document.createElement('span');
            resDate.innerText = dObj.toUTCString();

            result.appendChild(resDate);

            // add tags
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
            // display results
            this.blogDiv.innerHTML = `Results for: '${query}'`;
            this.blogDiv.appendChild(results);
        } else {
            // if no results suggest tags
            this.blogDiv.innerHTML = `No results found for: '${query}' Try these tags.`;
            const tagList = document.createElement('ul');

            // weight tags by how often they appear & sort by weight

            let tags: { [tag: string]: number } = {};

            for (let id in db) {
                for (let tag of db[id].tags) {
                    if (!tags[tag]) tags[tag] = 0;
                    tags[tag]++;
                }
            }

            let sortedTags = Object.keys(tags);

            sortedTags.sort((a, b) => tags[b] - tags[a]);

            for (let tag of sortedTags) {
                const tagLi = document.createElement('li');
                tagLi.appendChild(this.createTagLink(tag));
                tagList.appendChild(tagLi);
            }

            this.blogDiv.appendChild(tagList);
        }
    }

    createTagLink(tag: string) {
        const tagLink = document.createElement('a');
        tagLink.href = 'javascript:void(0);';
        tagLink.innerText = tag;
        tagLink.addEventListener('click', e => {
            e.preventDefault();
            this.search(tag);
        });
        return tagLink;
    }

    async openBlog(blogId: string) {

        window.history.replaceState('', '', updateURLParameter(window.location.href, 'blog', blogId));
        window.history.replaceState('', '', updateURLParameter(window.location.href, 'query', ''));
        this.currentId = blogId;
        await fetch(`/posts/${blogId}.html`).then(res => res.text()).then(html => this.blogDiv.innerHTML = html);

        // scroll blog view to top
        document.querySelector('.main-div').shadowRoot.querySelector('#main-content').scrollTo(0, 0);
    }
}

customElements.define('nce-blog-browser', BlogBrowser);

export interface BlogDatabase {
    [id: string]: {
        title: string,
        tags: string[],
        date: number,
    }
}