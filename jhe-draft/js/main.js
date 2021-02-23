import { AboutPage } from "./components/AboutPage.js";
import { ContactPage } from "./components/ContactPage.js";
import { HomePage } from "./components/HomePage.js";
import { NavBar } from "./components/NavBar.js";
import { ServicesPage } from "./components/ServicesPage.js";
console.log('Hello, PWA!');
async function preload() {
    // preload all required assets here
}
let splashClosed = false;
document.addEventListener('DOMContentLoaded', async () => {
    await preload();
    document.addEventListener('click', openHome);
});
//@ts-ignore
window.svgClickHandler = e => {
    openPage('home');
};
const contentDiv = document.querySelector('#content');
export const openPage = pageId => {
    if (document.querySelector('jhe-nav'))
        document.querySelector('jhe-nav').close();
    const pageManifest = {
        'home': HomePage,
        'about': AboutPage,
        'contact': ContactPage,
        'services': ServicesPage,
    };
    if (!pageManifest[pageId]) {
        console.error('Invalid page!');
        return;
    }
    if (document.querySelector('#page-container'))
        document.querySelector('#page-container').innerHTML = '';
    if (pageId == 'home') {
        openHome();
        return;
    }
    let newPage = new pageManifest[pageId];
    document.querySelector('#page-container').appendChild(newPage);
    newPage.classList.add('ani-fadeIn');
};
const openHome = () => {
    if (!splashClosed) {
        splashClosed = true;
        document.removeEventListener('click', openHome);
        document.querySelector('#splash').classList.add('ani-fadeOut');
        setTimeout(() => {
            document.querySelector('#splash').parentElement.removeChild(document.querySelector('#splash'));
        }, 330);
    }
    const navBar = new NavBar;
    if (!document.querySelector('jhe-nav'))
        contentDiv.appendChild(navBar);
    navBar.classList.add('ani-fadeIn');
    if (!document.querySelector('#page-container')) {
        const pc = document.createElement('div');
        pc.id = 'page-container';
        contentDiv.appendChild(pc);
    }
    if (!document.querySelector('#floating-logo')) {
        const fl = document.createElement('object');
        fl.id = 'floating-logo';
        fl.data = './img/logo.svg';
        fl.type = 'image/svg+xml';
        contentDiv.appendChild(fl);
        fl.classList.add('ani-fadeIn');
    }
    const newPage = new HomePage;
    document.querySelector('#page-container').appendChild(newPage);
    newPage.classList.add('ani-fadeIn');
    //TODO not DRY
};

//# sourceMappingURL=../maps/main.js.map
