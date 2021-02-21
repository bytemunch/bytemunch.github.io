export class AboutPage extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        let headline = document.createElement('h2');
        headline.style.position = 'absolute';
        headline.style.left = '20px';
        headline.style.top = '200px';
        headline.textContent = 'Ooooh an about page!';
        this.appendChild(headline);
        let flavourText = document.createElement('p');
        flavourText.style.position = 'absolute';
        flavourText.style.left = '20px';
        flavourText.style.top = '240px';
        flavourText.style.width = '40%';
        flavourText.textContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
        this.appendChild(flavourText);
    }
}
customElements.define('jhe-about', AboutPage);

//# sourceMappingURL=../../maps/components/AboutPage.js.map
