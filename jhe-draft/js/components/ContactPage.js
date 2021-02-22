export class ContactPage extends HTMLElement {
    constructor() {
        super();
    }
    applyStyles() {
    }
    connectedCallback() {
        this.applyStyles();
        this.classList.add('page');
        let headline = document.createElement('h2');
        headline.style.textAlign = 'center';
        headline.textContent = 'Contact us, anytime!';
        this.appendChild(headline);
        let phoneLine = document.createElement('div');
        phoneLine.style.width = '100%';
        phoneLine.style.padding = '0 10%';
        let phoneNumber = document.createElement('p');
        phoneNumber.classList.add('phone-number');
        phoneNumber.textContent = '07474744747';
        phoneLine.appendChild(phoneNumber);
        this.appendChild(phoneLine);
        let phoneIcon = document.createElement('img');
        phoneIcon.classList.add('icon-phone');
        phoneIcon.src = './img/phone.svg';
        phoneLine.appendChild(phoneIcon);
    }
}
customElements.define('jhe-contact', ContactPage);

//# sourceMappingURL=../../maps/components/ContactPage.js.map
