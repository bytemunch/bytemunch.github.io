# Dodgey Ball Devlog #3

## User Interfaces

So a friend of mine when playing the game said "It's kinda like 3D pong!". Not too sure how i feel about that, hopefully the game will gain some character once there's artwork. I mean pong was a pretty successful game I guess..?

Anyway, work.

Game work good. Game look bad. We fix UI.

### Cleaner Buttons
For UI I want something friendly and clean looking; bright colours, rounded corners, bold iconography. I'm also going to be solving the problem of navigating HTML elements with a controller, assuming no-one has done it in a reusable way yet.

Nothing's popped up on a quick google, so looks like I'm implementing that from scratch. Hopefully in a way that's more useful than this single project too.

But I'm getting ahead of myself, let's design some buttons first.

![new buttons: setup screen](img/blog/newbuttons-matchsetup.png)

This'll do for now, the colours aren't going to be finalized until I've decided on the game's whole artstyle, but these will do as a stand-in while I work on some other features.

![new buttons: controller setup](img/blog/newbuttons-controllersetup.png)

So next up I'll create a more robust screen management system to move between, open and close different menu screens, which are going to be implemented as Custom Elements so they can handle their own actions.

```ts
export class CustomElement extends HTMLElement {
    tempID: string = '';
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    applyStyle() {
        // walk inheritance tree to find all applicable styles
        let parentClass = Object.getPrototypeOf(Object.getPrototypeOf(this));
        let parentClassName = parentClass.constructor.name;

        let parentStyles = [];

        while (parentClassName !== 'HTMLElement') {
            let newStyle = document.createElement('link');
            newStyle.rel = "stylesheet";
            newStyle.href = `./styles/${parentClassName}.css`;

            parentStyles.push(newStyle);

            parentClass = Object.getPrototypeOf(parentClass);
            parentClassName = parentClass.constructor.name;
        }

        // reverse for correct priority
        parentStyles.reverse().forEach(style => this.shadowRoot.appendChild(style));

        let newStyle = document.createElement('link');
        newStyle.rel = "stylesheet";
        newStyle.href = `./styles/${this.constructor.name}.css`;
        this.shadowRoot.appendChild(newStyle);
    }

    connectedCallback() {
        this.applyStyle();

        const template = (<HTMLTemplateElement>document.querySelector(`#${this.tempID}-template`))?.content;

        if (template) this.shadowRoot.appendChild(template.cloneNode(true));
    }
}

customElements.define('ce-custom-element', CustomElement);
```

Everything that needs functionality will extend this class, which provides me with an inheritance based CSS tree and pulls the HTML content from a template in index.html

![navigating the new menus](img/blog/newmenus.gif)

### Page Management

So now we have some custom elements, how will we go between them? Personally I think that
```ts
btnPlay() {
    this.splashScreen.style.display = 'none';
}
```
has run it's course. I'm also going to need to manage the history object *(oh yay)* to allow for the back button to work as expected on Android.

Oh the work we do to avoid a page refresh.

So after a bit of fiddling I've found the correct way to override and mess about with `hashchange` events to get the game feeling like an app. Pressing back during gameplay brings up the pause menu, and backing out from the splash navigates to wherever the browser was before, or expected behaviour on phones would be to close the browser.

```ts
window.addEventListener('hashchange', e => {
    e.preventDefault();

    let newHash = location.hash.replace('#', '');

    if (this.currentPage == 'gameover') { newHash = 'setup' }
    if (this.currentPage == 'play' && newHash != 'gameover') { newHash = 'pause'; game.pause() }
    if (this.currentPage == 'setup' && newHash == 'pause') { newHash = 'controller'; }

    // Eliminates doubled entries in history caused by this messing about
    if (this.currentPage == newHash) history.back();

    history.replaceState(null, 'unused', '#' + newHash)

    this.openScreen(newHash);
});
```

I hate state management. That codeblock was a good 45 minute headache. But it seems to be working as expected now so it was a worth-it headache.

### Gamepad Menuing

Now to set about getting the menus navigatable with a gamepad. My initial thought for how to go about this was to add a 2D array to each page and keep track of what element is on each side of the others, but I'd like to look into if I can use the CSS grid that the screens are laid out on to sort this all out programatically.

After a bit of research, realising that CSS doesn't expose the grid in an easily digestable way, and thinking that a position array would be overkill, I've settled on hardcoding *(eww)* the directional neighbours on the screen element.

```ts
gamepadDirections = {
    'play': { up: 'clear-data', down: 'clear-data', left: '', right: '' },
    'clear-data': { up: 'play', down: 'play', left: 'audio-toggle', right: 'audio-toggle' },
    'audio-toggle': { up: 'play', down: 'play', left: 'clear-data', right: 'clear-data' },
}

gamepadMove(direction) {
    // get current focused element
    const focused = this.shadowRoot.activeElement?.id;

    if (!focused) {
        // if none default to first focusable element
        (<HTMLInputElement>this.shadowRoot.querySelector('#' + Object.keys(this.gamepadDirections)[0])).focus();
        return;
    }

    // skip out if there's no element in that direction
    if (!this.gamepadDirections[focused][direction]) return;

    // find next element in direction & focus
    (<HTMLInputElement>this.shadowRoot.querySelector('#' + this.gamepadDirections[focused][direction])).focus();
}
```

It ain't the prettiest, but it works... With arrow keys. Now to feed it gamepad inputs while in menu.

![controller navigation](img/blog/controller-nav.gif)

Controller menuing done! A much less elegant solution than I would have liked, but it's good enough for purpose so I can't complain. I bumped the border width up on menu items but a fair chunk too, it was really hard to see what was selected at a glance.

Well that's all I set out to get done today. The hashchange stuff is still buggin out on refreshes but that's sounding a lot like a tomorrow problem.

Peace.