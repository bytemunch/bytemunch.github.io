import { Page } from "./Page.js";

export class PageHome extends Page {
    async render() {
        this.addNavLinks();

        this.addImages();

        this.addEmptyDivs();

        await this.animate();
    }
}