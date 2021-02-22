import { openPage } from "../main.js";
export class NavBar extends HTMLElement {
    constructor() {
        super();
    }
    toggleState() {
        if (this.classList.contains('open')) {
            this.classList.remove('open');
            return;
        }
        this.classList.add('open');
    }
    close() {
        this.classList.remove('open');
    }
    applyStyle() {
    }
    connectedCallback() {
        this.applyStyle();
        const menuIcon = document.createElement('img');
        menuIcon.src = './img/menu.svg';
        menuIcon.classList.add('icon-menu');
        menuIcon.addEventListener('click', () => {
            this.classList.add('open');
        });
        this.appendChild(menuIcon);
        const linksDiv = document.createElement('div');
        linksDiv.classList.add('nav-links-div');
        const logo = document.createElement('object');
        logo.classList.add('nav-logo');
        logo.data = "./img/logo.svg";
        logo.type = "image/svg+xml";
        logo.style.float = "left";
        linksDiv.appendChild(logo);
        const homeLink = document.createElement('a');
        homeLink.textContent = 'HOME';
        homeLink.classList.add('nav-link');
        homeLink.id = 'nav-link-home';
        homeLink.href = '#';
        homeLink.addEventListener('click', () => openPage('home'));
        linksDiv.appendChild(homeLink);
        const aboutLink = document.createElement('a');
        aboutLink.textContent = 'ABOUT';
        aboutLink.classList.add('nav-link');
        aboutLink.href = '#';
        aboutLink.addEventListener('click', () => openPage('about'));
        linksDiv.appendChild(aboutLink);
        const contactLink = document.createElement('a');
        contactLink.textContent = 'CONTACT';
        contactLink.classList.add('nav-link');
        contactLink.href = '#';
        contactLink.addEventListener('click', () => openPage('contact'));
        linksDiv.appendChild(contactLink);
        this.appendChild(linksDiv);
        window.addEventListener('resize', this.close.bind(this));
    }
}
customElements.define('jhe-nav', NavBar);

//# sourceMappingURL=../../maps/components/NavBar.js.map
