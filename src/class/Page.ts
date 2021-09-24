class Page {
	name;
	complexity;
	main;
	images;

	constructor(name) {
		this.name = name;
		this.complexity = 4;
	}

	async render() {
		await getPage(this.name)
			.then(res => {
				this.main = res.main || 'empty';
				this.images = res.images || 'empty';
			});

		let divs = [];

		// MAIN DIV
		if (this.main && this.main !== 'empty') {

			let mainpos = findSpace(width / 1.5, width / 1.7, height / 1.5, height / 2);

			mainpos = {
				x: width / 24,
				y: height / 7,
				width: width / 1.5,
				height: height / 1.5
			}

			// MIN WIDTH 280px
			if (mainpos.width < 260) {
				mainpos.width = 260;
				mainpos.x = 5;
				mainpos.y = 25;
			}
			//TODO minmax

			let main = newDiv(mainpos);

			main.style.overflowX = 'hidden';
			main.style.overflowY = 'auto';
			

			if (main) {
				let titlediv = document.createElement('div');
				let title = document.createElement('h3');
				let text = document.createElement('p');

				titlediv.classList.add('linkbox');
				titlediv.classList.add('maintitle');
				titlediv.style.width = 'calc(100% - ' + (linew * 2) + 'px)';
				titlediv.style.position = 'relative';
				titlediv.style.marginLeft = -linew + '';
				titlediv.style.marginTop = -linew + '';
				titlediv.style.marginBottom = linew;
				titlediv.style.borderWidth = linew;
				titlediv.style.paddingLeft = linew;
				titlediv.style.paddingRight = linew;

				titlediv.style.backgroundColor = 'white';

				main.classList.add(this.main.title.replace(' ', '-'));
				title.textContent = this.main.title || 'TITLE 404';
				text.textContent = this.main.text || 'TEXT 404';

				titlediv.appendChild(title);
				titlediv.appendChild(text);

				main.appendChild(titlediv);

				divs.push(main);
				document.body.appendChild(main);
			}

			if (this.name == 'portfolio') {
				let links = [
					{
						text: 'JHE Electrical',
						link: 'https://bytemunch.github.io/jhe-draft/',
						desc: 'A draft site for a friend. I didn\'t design the logo, but did add the animations.',
						repo: 'https://github.com/bytemunch/jhe'
					},
					{
						text: 'Drink!',
						link: 'https://ring-of-fire-5d1a4.web.app/',
						desc: 'A multiplayer realtime drinking game app. In active (eternal) development.',
						repo: ''
					},
					{
						text: 'Fresh Decorators',
						link: 'https://bytemunch.github.io/fresh/index.html',
						desc: 'A site I was partway through making when the client decided they didn\'t want it anymore. Takeaway: get contracts signed for freelance work!',
						repo: ''
					},
				]

				let linkColor = 'white';
				if (main.style.backgroundColor === 'white' || main.style.backgroundColor === 'yellow') {
					linkColor = 'black';
				}

				for (let link of links) {
					let linkDiv = document.createElement('div');

					let desc = document.createElement('p');
					desc.textContent = link.desc;
					desc.style.color = linkColor;
					desc.style.marginLeft = (linew * 2) + '';
					desc.style.marginBottom = (linew * 2) + '';

					let titleDiv = document.createElement('div');

					let htmlLink = document.createElement('a');
					htmlLink.textContent = link.text;
					htmlLink.href = link.link;
					htmlLink.target = '_blank';

					htmlLink.style.margin = linew;
					htmlLink.style.color = linkColor;
					htmlLink.style.fontWeight = 'bold';

					let linkImg = document.createElement('img');
					linkImg.src = linkColor == 'black' ? './img/link-24px.png' : './img/link-24px-light.png';
					linkImg.classList.add('linkimg');

					htmlLink.appendChild(linkImg);

					titleDiv.appendChild(htmlLink);

					if (link.repo) {
						let githubLink = document.createElement('a');
						githubLink.href = link.repo;
						githubLink.target = '_blank';
	
						let githubImg = document.createElement('img');
						githubImg.src = linkColor == 'black' ? './img/GitHub-Mark-32px.png':'./img/GitHub-Mark-Light-32px.png';
						githubImg.classList.add('linkimg');
	
						githubLink.appendChild(githubImg);
						titleDiv.appendChild(githubLink);
					}

					linkDiv.appendChild(titleDiv);
					linkDiv.appendChild(desc);

					main.appendChild(linkDiv);
				}
			}

			if (this.name == 'funstuff') {
				/*
				//TODO pop this in it's own function or something
				main.style.backgroundColor = 'transparent';

				let frame = document.createElement('iframe');
				frame.style.height = 'calc(80% - ' + linew + 'px)';
				frame.style.top = 'calc(20% + ' + linew + 'px)';
				frame.style.width = '100%';
				frame.style.marginLeft = -linew + '';
				frame.style.marginTop = -linew + '';
				frame.style.borderWidth = linew;

				frame.classList.add('linkbox');

				frame.scrolling = 'no';
				frame.style.borderWidth = linew;
				frame.src = '//' + rooturi + '/doodles/scribbler';
				main.appendChild(frame);

				//DOODLE NAV
				let nav = {
					next: document.createElement('a'),
					prev: document.createElement('a'),
					drop: document.createElement('select')
				}

				let doodles = [];

				fetch('./doodles/index.json')
					.then(res => res.json())
					.then(doodles => {
						for (let doodle in doodles) {
							let opt = document.createElement('option');
							opt.value = doodles[doodle].link;
							opt.textContent = doodle;

							nav.drop.appendChild(opt);
						}
					})

				// for projects in doodles
				// doodles.json?
				// add link to array
				// create option
				// append to select

				// add onchange listener
				// set initial state

				nav.drop.style.position = 'absolute';
				nav.drop.style.top = '5px';
				nav.drop.style.right = '105px';

				let titlediv = document.querySelector('.maintitle');
				titlediv.appendChild(nav.drop);

				nav.next.addEventListener('click', () => {
					console.log('nclicky');
				});

				nav.prev.addEventListener('click', () => {
					console.log('pclicky');
				});

				nav.drop.addEventListener('change', e => {
					//console.log(this);
					frame.src = '//' + rooturi + '/doodles/' + nav.drop.value;
				});

				//next/prev
				let i = 0;
				for (let btn in nav) {
					if (btn !== 'drop') {
						nav[btn].style.position = 'absolute';
						nav[btn].style.top = '5px';
						nav[btn].style.right = ((i * 35) + 5) + 'px';

						nav[btn].textContent = btn;
						titlediv.appendChild(nav[btn]);

						i++;
					}
				}*/

				let links = [
					{
						text: 'Shitty Ball Game',
						link: 'https://bytemunch.github.io/apps/shitty-ball-game',
						desc: 'September 2021. Does what it says on the tin, it\'s another shitty ball game!.',
						repo: ''
					},
					{
						text: 'Advertising Game',
						link: 'https://bytemunch.github.io/apps/advert',
						desc: 'March 2020. My take on an idle game. Not sure where I was going with it, but I got halfway there! Wherever there is...',
						repo: ''
					},
					{
						text: 'Meme Man Facebook App',
						link: 'https://meme-man-test.web.app/',
						desc: 'March 2020. A zero effort facebook test. Made one morning to get a better handle on Facebook APIs. Since removed Facebook APIs because apparently the app was "too low quality" or something.',
						repo: 'https://github.com/bytemunch/meme-man-test'
					},
				]

				let linkColor = 'white';
				if (main.style.backgroundColor === 'white' || main.style.backgroundColor === 'yellow') {
					linkColor = 'black';
				}

				for (let link of links) {
					let linkDiv = document.createElement('div');

					let desc = document.createElement('p');
					desc.textContent = link.desc;
					desc.style.color = linkColor;
					desc.style.marginLeft = (linew * 2) + '';
					desc.style.marginBottom = (linew * 2) + '';

					let titleDiv = document.createElement('div');

					let htmlLink = document.createElement('a');
					htmlLink.textContent = link.text;
					htmlLink.href = link.link;
					htmlLink.target = '_blank';

					htmlLink.style.margin = linew;
					htmlLink.style.color = linkColor;
					htmlLink.style.fontWeight = 'bold';

					let linkImg = document.createElement('img');
					linkImg.src = linkColor == 'black' ? './img/link-24px.png' : './img/link-24px-light.png';
					linkImg.classList.add('linkimg');

					htmlLink.appendChild(linkImg);

					titleDiv.appendChild(htmlLink);

					if (link.repo) {
						let githubLink = document.createElement('a');
						githubLink.href = link.repo;
						githubLink.target = '_blank';
	
						let githubImg = document.createElement('img');
						githubImg.src = linkColor == 'black' ? './img/GitHub-Mark-32px.png':'./img/GitHub-Mark-Light-32px.png';
						githubImg.classList.add('linkimg');
	
						githubLink.appendChild(githubImg);
						titleDiv.appendChild(githubLink);
					}

					linkDiv.appendChild(titleDiv);
					linkDiv.appendChild(desc);

					main.appendChild(linkDiv);
				}

			}
			
		}

		//NAV LINKS
		for (let l of links) {
			if (l.link.replace('#', '') !== this.name) {
				let pos = findSpace(maxw, minw, maxh, minh);
				let div = newDiv(pos, l.img, l.link, l.txt);
				if (div) {
					divs.push(div);
					document.body.appendChild(div);
				}
			}
		}

		// IMAGES
		if (this.images !== 'empty') {
			for (let i in this.images) {
				let ipos = findSpace(maxw, minw, maxh, minh);
				let image = newDiv(ipos, this.images[i]);
				if (image) {
					divs.push(image);
					document.body.appendChild(image);
				}
			}
		}

		// XTRAS
		let space = true;
		let i = 0;

		while (space && i < this.complexity) {
			i++;
			let pos = findSpace(maxw, minw, maxh, minh);
			if (pos) {
				let div = newDiv(pos);
				if (div) document.body.appendChild(div);
			} else {
				space = false;
			}
		}

		// ANIMATE
		fadeIn(divs, 0.05, () => {
			addAllRunners(() => {
				drawLines(() => {
					finishedAnimation();
				});
			})
		});
	}
}