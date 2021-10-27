import { CeBlogBrowser } from "../elements/CeBlogBrowser.js";
import { Page } from "./Page.js";

export class PageBlog extends Page {
    name = 'blog';
    async addMain() {
        let searchParams = new URLSearchParams(window.location.search);
        const gotPost = searchParams.has('post');

        this.main = new CeBlogBrowser('the blog', 'i write about stuff', 'white', 'black', !gotPost);
        document.body.appendChild(this.main);
        if (gotPost) (<CeBlogBrowser>this.main).writeBlog(searchParams.get('post'));

        await this.main.ready;
    }
}