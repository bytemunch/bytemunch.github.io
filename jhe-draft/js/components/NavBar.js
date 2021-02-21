import { openAbout, openContact } from "../main.js";
export class NavBar extends HTMLElement {
    constructor() {
        super();
    }
    applyStyle() {
        this.style.position = "absolute";
        this.style.top = "0";
        this.style.left = "0";
        this.style.width = "100%";
        this.style.height = "128px";
        this.style.background = "#fafafa";
        this.style.boxShadow = "0px 0px 5px 0px black";
    }
    connectedCallback() {
        this.applyStyle();
        const logo = document.createElement('object');
        logo.data = "./img/logo.svg";
        logo.type = "image/svg+xml";
        logo.style.height = "100%";
        logo.style.float = "left";
        logo.style.display = "inline-block";
        this.appendChild(logo);
        const aboutLink = document.createElement('a');
        aboutLink.textContent = 'ABOUT';
        aboutLink.classList.add('nav-link');
        aboutLink.href = '#';
        aboutLink.addEventListener('click', openAbout);
        this.appendChild(aboutLink);
        const contactLink = document.createElement('a');
        contactLink.textContent = 'CONTACT';
        contactLink.classList.add('nav-link');
        contactLink.href = '#';
        contactLink.addEventListener('click', openContact);
        this.appendChild(contactLink);
    }
}
customElements.define('jhe-nav', NavBar);

//# sourceMappingURL=../../maps/components/NavBar.js.map
