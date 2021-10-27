import { CeMain } from "../elements/CeMain.js";
import { Page } from "./Page.js";

export class PageAbout extends Page {
    name = 'about';
    async addMain() {
        this.main = new CeMain('about me', 'i make stuff online. more deets to be added once they\'re all on-brand and that.', 'blue', 'white');
        document.body.appendChild(this.main);

        const email = document.createElement('a');
        email.style.color = 'white';
        email.href = 'mailto:sam@edelsten.me';
        email.textContent = 'Email me!';
        this.main.appendToMain(email);

        await this.main.ready;

        // TODO add contact infoooooooooo
        // TODO and socialsssssss
    }
}