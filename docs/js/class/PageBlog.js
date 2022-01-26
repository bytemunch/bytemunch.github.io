import { BlogBrowser } from "../components/BlogBrowser.js";
import { CeMain } from "../elements/CeMain.js";
import { Page } from "./Page.js";
export class PageBlog extends Page {
    constructor() {
        super(...arguments);
        this.name = 'blog';
    }
    async addMain() {
        this.main = new CeMain('the blog', 'i write about stuff', 'white', 'black');
        document.body.appendChild(this.main);
        await this.main.ready;
        const blogBrowser = new BlogBrowser;
        await blogBrowser.loaded;
        await blogBrowser.connectedCallback();
        await blogBrowser.connectedOnce;
        this.main.shadowRoot.appendChild(blogBrowser.stylesheet);
        this.main.appendToTitle(blogBrowser.navDiv);
        this.main.appendToMain(blogBrowser.blogDiv);
    }
}
//# sourceMappingURL=PageBlog.js.map