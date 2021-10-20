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
        name: 'Shitty Ball Game',
        link: 'https://bytemunch.github.io/projects/apps/shitty-ball-game',
        description: 'Does what it says on the tin, it\'s another shitty ball game!.',
        repo: 'https://github.com/bytemunch/shitty-ball-game'
    },
    {
        name: 'Fertiliser Farmer',
        link: 'https://bytemunch.github.io/projects/apps/fertiliser-farmer',
        description: 'It\'s a mobile merging game! There was intention to flesh this out but the joke got old and my passion for manure-based tile merging games kinda died.',
        repo: 'https://github.com/bytemunch/fertiliser-farmer'
    },
    {
        name: 'Advertising Game',
        link: 'https://bytemunch.github.io/projects/apps/advert',
        description: 'My take on an idle game. Not sure where I was going with it, but I got halfway there! Wherever there is...',
        repo: ''
    },
    {
        name: 'Meme Man Facebook App',
        link: 'https://meme-man-test.web.app/',
        description: 'A zero effort facebook test. Made one morning to get a better handle on Facebook APIs. Since removed Facebook APIs because apparently the app was "too low quality" or something.',
        repo: 'https://github.com/bytemunch/meme-man-test'
    },
]
export class PagePlay extends Page {
    name = 'funstuff';
    async addMain() {
        this.main = new CeMain('play', 'the home for the equivalent of shitposting in webdev form', 'yellow', 'black');

        for (let p of projects) {
            this.main.appendToMain(new CeProjectLink(p.name, p.description, p.link, p.repo, 'black'));
        }

        document.body.appendChild(this.main);

        await this.main.ready;
    }
}