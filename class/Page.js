class Page {
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
            //TODO minmax

            let main = newDiv(mainpos);

            if (main) {
                let titlediv = document.createElement('div');
                let title = document.createElement('h3');
                let text = document.createElement('p');

                titlediv.classList.add('linkbox');
                titlediv.classList.add('maintitle');
                titlediv.style.width = 'calc(100% - '+(linew*2)+'px)';
                titlediv.style.height = '20%';
                titlediv.style.position = 'relative';
                titlediv.style.marginLeft = -linew;
                titlediv.style.marginTop = -linew;
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
                let drinkLink = document.createElement('a');
                drinkLink.textContent = 'Drink!';
                drinkLink.href = 'https://drink-with.us';
                drinkLink.target = '_blank';

                drinkLink.style.margin = linew;

                console.log(main);

                if (main.style.backgroundColor !== 'white' && main.style.backgroundColor !== 'yellow') {
                    drinkLink.style.color = 'white';
                } else {
                    drinkLink.style.color = 'black';
                }

                main.appendChild(drinkLink);
            }

            if (this.name == 'funstuff') {
                //TODO pop this in it's own function or something
                main.style.backgroundColor = 'transparent';

                let frame = document.createElement('iframe');
                frame.style.height = 'calc(80% - '+linew+'px)';
                frame.style.top = 'calc(20% + '+linew+'px)';
                frame.style.width = '100%';
                frame.style.marginLeft = -linew;
                frame.style.marginTop = -linew;
                frame.style.borderWidth = linew;

                frame.classList.add('linkbox');

                frame.scrolling = 'no';
                frame.style.borderWidth = linew;
                frame.src = '//'+rooturi+'/doodles/scribbler';
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
                    frame.src = '//'+rooturi+'/doodles/'+nav.drop.value;
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