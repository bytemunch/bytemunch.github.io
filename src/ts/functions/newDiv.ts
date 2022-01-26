import { XYWH } from '../class/Mondrian.js';
import { pickColor } from './pickColor.js';
import { sizeText } from './sizeText.js';

export function newDiv(pos: XYWH, img?: string, link?: string, txt?: string) {
	let div = document.createElement('div') as HTMLDivElement;
	let color = '';

	switch (txt) {
		case 'me':
			color = 'blue';
			break;
		case 'work':
			color = 'red';
			break;
		case 'play':
			color = 'yellow';
			break;
		case 'blog':
			color = 'white';
			break;
		default:
			color = pickColor();
			break;
	}

	div.style.left = pos.x.toString();
	div.style.top = pos.y.toString();

	if (pos.width) div.style.width = pos.width.toString();
	if (pos.height) div.style.height = pos.height.toString();

	div.style.backgroundColor = color;

	div.classList.add('linkbox');

	if (txt) {
		let title = document.createElement('h2');
		title.textContent = txt.toUpperCase();


		title.className = 'linktext';
		title.style.fontSize = '0';

		sizeText(title, pos.width, pos.height);

		// set 100% width after got appropriate size
		title.style.width = '100%';

		switch (color) {
			case 'white':
			case 'yellow':
			case 'transparent':
				title.style.color = 'black';
				break;
			default:
				title.style.color = 'white';
				break;
		}

		div.appendChild(title);
		div.classList.add('linkbox');
	}

	if (img) {
		let overlay = document.createElement('div');
		overlay.classList.add('overlay');
		overlay.style.backgroundColor = color;
		div.appendChild(overlay);

		div.style.backgroundImage = "url('" + img + "')";
		div.style.backgroundPositionX = 'center';
	}

	// Append to body here or return div?
	if (link) {
		let a = document.createElement('a');
		a.href = link;
		a.classList.add('link');
		a.appendChild(div);

		a.addEventListener('click', e => {
			// openPage(link);
			// clear search params

			let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + location.hash;
			window.history.pushState({ path: newurl }, '', newurl);
		});

		return a;
	} else {
		return div;
	}
}


