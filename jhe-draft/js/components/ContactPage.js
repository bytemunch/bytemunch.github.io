export class ContactPage extends HTMLElement {
    constructor() {
        super();
    }
    applyStyles() {
        this.style.width = "500px";
        this.style.background = '#fafafa';
        this.style.margin = 'auto';
        this.style.display = 'block';
        this.style.height = '80%';
        this.style.position = 'relative';
        this.style.top = '132px';
        this.style.padding = '5px';
        this.style.boxShadow = "0px 0px 5px 0px black";
    }
    connectedCallback() {
        this.applyStyles();
        let headline = document.createElement('h2');
        headline.style.textAlign = 'center';
        headline.textContent = 'Contact us, anytime!';
        this.appendChild(headline);
        let phoneLine = document.createElement('div');
        phoneLine.style.width = '100%';
        phoneLine.style.padding = '0 10%';
        let phoneIcon = document.createElement('img');
        phoneIcon.style.width = '32px';
        phoneIcon.style.height = '32px';
        phoneIcon.style.position = "absolute";
        phoneIcon.style.top = "75px";
        phoneIcon.style.left = "128px";
        phoneIcon.src = './img/phone.svg';
        phoneLine.appendChild(phoneIcon);
        let phoneNumber = document.createElement('p');
        phoneNumber.style.fontSize = 'x-large';
        phoneNumber.style.textAlign = 'center';
        phoneNumber.textContent = '07474744747';
        phoneLine.appendChild(phoneNumber);
        this.appendChild(phoneLine);
    }
}
customElements.define('jhe-contact', ContactPage);

//# sourceMappingURL=../../maps/components/ContactPage.js.map
