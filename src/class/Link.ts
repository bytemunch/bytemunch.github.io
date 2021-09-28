// TODO this should be an interface

export class Link {
	img;
	link;
	txt;

	constructor(img, link, txt) {
		this.img = img;
		this.link = link;
		this.txt = txt;
	}
}