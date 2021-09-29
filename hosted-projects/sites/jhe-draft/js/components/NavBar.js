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
        linksDiv.appendChild(linkFactory('home', 'HOME', 'nav-link'));
        linksDiv.appendChild(linkFactory('about', 'ABOUT', 'nav-link'));
        let servicesButton = document.createElement('button');
        servicesButton.classList.add('nav-link');
        servicesButton.innerText = 'SERVICES';
        linksDiv.appendChild(servicesButton);
        let servicesList = document.createElement('div');
        servicesList.classList.add('nav-l2-div');
        servicesList.appendChild(linkFactory('service1', 'SERVICE 1', 'nav-l2-link'));
        servicesList.appendChild(linkFactory('service2', 'SERVICE 2', 'nav-l2-link'));
        servicesList.appendChild(linkFactory('service3', 'SERVICE 3', 'nav-l2-link'));
        servicesList.appendChild(linkFactory('service4', 'SERVICE 4', 'nav-l2-link'));
        servicesButton.addEventListener('click', () => {
            if (servicesList.classList.contains('open')) {
                servicesList.classList.remove('open');
            }
            else {
                if (window.innerWidth >= 767) {
                    servicesList.style.left = servicesButton.getBoundingClientRect().left + 'px';
                    servicesList.style.top = servicesButton.getBoundingClientRect().bottom + 'px';
                }
                else {
                    servicesList.style.left = 0 + 'px';
                    servicesList.style.top = 0 + 'px';
                }
                servicesList.classList.add('open');
            }
        });
        linksDiv.appendChild(servicesList);
        linksDiv.appendChild(linkFactory('contact', 'CONTACT', 'nav-link'));
        this.appendChild(linksDiv);
        window.addEventListener('resize', () => {
            console.log('resized');
            document.querySelectorAll('jhe-nav').forEach(v => v.classList.remove('open'));
            this.close.bind(this);
            servicesList.classList.remove('open');
        });
    }
}
const linkFactory = (id, text, c) => {
    const newLink = document.createElement('button');
    newLink.textContent = text;
    newLink.classList.add(c);
    newLink.addEventListener('click', () => {
        openPage(id);
    });
    return newLink;
};
customElements.define('jhe-nav', NavBar);

//# sourceMappingURL=../../maps/components/NavBar.js.map
