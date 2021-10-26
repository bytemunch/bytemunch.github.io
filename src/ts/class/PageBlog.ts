import { CeBlogBrowser } from "../elements/CeBlogBrowser.js";
import { Page } from "./Page.js";

export class PageBlog extends Page {
    name = 'blog';
    async addMain() {
        this.main = new CeBlogBrowser('the blog', 'i write about stuff', 'white', 'black');
        document.body.appendChild(this.main);

        // (<CeBlogBrowser>this.main).writeBlog('dodgey-ball-0');

        await this.main.ready;
    }
}