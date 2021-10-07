import { CeMain } from "../elements/CeMain.js";
import { Page } from "./Page.js";

export class PageAbout extends Page {
    name = 'about';
    async addMain() {
        this.main = new CeMain('about me', 'i make stuff online', 'blue', 'white');
        document.body.appendChild(this.main);

        await this.main.ready;
    }
}