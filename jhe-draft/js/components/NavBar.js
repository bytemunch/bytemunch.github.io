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
        linksDiv.appendChild(linkFactory('home', 'HOME'));
        linksDiv.appendChild(linkFactory('about', 'ABOUT'));
        linksDiv.appendChild(linkFactory('services', 'SERVICES'));
        linksDiv.appendChild(linkFactory('contact', 'CONTACT'));
        this.appendChild(linksDiv);
        window.addEventListener('resize', this.close.bind(this));
    }
}
const linkFactory = (id, text) => {
    const newLink = document.createElement('a');
    newLink.textContent = text;
    newLink.classList.add('nav-link');
    newLink.href = '#' + id;
    newLink.addEventListener('click', () => openPage(id));
    return newLink;
};
customElements.define('jhe-nav', NavBar);

//# sourceMappingURL=../../maps/components/NavBar.js.map
