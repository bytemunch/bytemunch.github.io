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
        const phoneLine = contactLineFactory('07764292985', 'phone');
        this.appendChild(phoneLine);
        const linkedEmail = document.createElement('a');
        linkedEmail.href = 'mailto:exampple@example.com';
        const emailLine = contactLineFactory('quotes@jhe-electrical.co.uk', 'email');
        linkedEmail.appendChild(emailLine);
        this.appendChild(linkedEmail);
    }
}
const contactLineFactory = (text, icon) => {
    let newLine = document.createElement('div');
    newLine.classList.add('contact-line');
    let phoneIcon = document.createElement('img');
    phoneIcon.classList.add('contact-icon', `icon-${icon}`);
    phoneIcon.src = `./img/${icon}.svg`;
    newLine.appendChild(phoneIcon);
    let lineTxt = document.createElement('p');
    lineTxt.classList.add('contact-text');
    lineTxt.textContent = text;
    newLine.appendChild(lineTxt);
    return newLine;
};
customElements.define('jhe-contact', ContactPage);

//# sourceMappingURL=../../maps/components/ContactPage.js.map
