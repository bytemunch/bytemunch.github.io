import { BlogBrowser } from "../components/BlogBrowser.js";
import { CeBlogBrowser } from "../elements/CeBlogBrowser.js";
import { Page } from "./Page.js";
export class PageBlog extends Page {
    constructor() {
        super(...arguments);
        this.name = 'blog';
    }
    async addMain() {
        this.main = new CeBlogBrowser('the blog', 'i write about stuff', 'white', 'black');
        document.body.appendChild(this.main);
        this.main.appendToMain(new BlogBrowser);
        await this.main.ready;
    }
}
//# sourceMappingURL=PageBlog.js.map