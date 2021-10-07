import { CeMain } from "../elements/CeMain.js";
import { CeProjectLink } from "../elements/CeProjectLink.js";
import { Page } from "./Page.js";

interface Proj {
    name: string,
    description: string,
    link: string,
    repo?: string
}

const projects: Proj[] = [
    {
        name: 'JHE Electrical',
        description: 'A draft site for a friend. I didn\'t design the logo, but did add the animations.',
        link: 'https://bytemunch.github.io/projects/sites/jhe-draft/',
        repo: 'https://github.com/bytemunch/jhe'
    },
    {
        name: 'Drink!',
        description: 'A multiplayer realtime drinking game app. In active (eternal) development.',
        link: 'https://ring-of-fire-5d1a4.web.app/'
    },
    {
        name: 'Fresh Decorators',
        description: 'A site I was partway through making when the client decided they didn\'t want it anymore. Takeaway: get contracts signed for freelance work!',
        link: 'https://bytemunch.github.io/projects/sites/fresh-decorators/index.html'
    }
]

export class PagePortfolio extends Page {
    name = 'portfolio';
    async addMain() {
        this.main = new CeMain('portfolio', 'this is a portfolio page', 'red', 'white');

        for (let p of projects) {
            this.main.appendToMain(new CeProjectLink(p.name, p.description, p.link, p.repo));
        }

        document.body.appendChild(this.main);

        await this.main.ready;
    }
}