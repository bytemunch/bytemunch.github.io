
function newDiv(pos, img, link, txt) {
    if (pos) {
        let div = document.createElement('div');
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
            default:
                color = pickColor();
                break;
        }

        div.style.left = pos.x;
        div.style.top = pos.y;
        div.style.width = pos.width;
        div.style.height = pos.height;
        div.style.borderWidth = linew;
        div.style.backgroundColor = color;
        div.style.overflow = 'hidden';
        //div.style.opacity = 0;
        div.classList.add('linkbox');

        if (txt) {
            let title = document.createElement('h2');
            title.textContent = txt.toUpperCase();

            title.className = 'linktext';

            title.style.fontSize = 0;

            sizeText(title, pos.width, pos.height);

            title.style.width = '100%';
            title.style.height = '100%';

            title.style.zIndex = '1';

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
            overlay.style.width = '150%';
            overlay.style.height = '150%';
            overlay.classList.add('overlay');
            overlay.style.backgroundColor = color;
            overlay.style.opacity = '0.5';
            overlay.style.position = 'absolute';
            overlay.style.top = 0;
            overlay.style.left = 0;
            div.appendChild(overlay);

            div.style.backgroundImage = "url('" + img + "')";
            div.style.backgroundPositionX = 'center';

            // mousey moving TODO this is shit
            // something to do with image aspects rather than container?
            // offset from center by portion of layerX layerY

            div.addEventListener('mousemove', e => {

                let newPos = (e.layerX / div.style.width.replace('px', '')) * 100;

                newPos = reRange(newPos, 0, 100, 40, 60);

                div.style.backgroundPositionX = newPos + '%';

            });

            div.addEventListener('mouseout', e => {
                // console.log(e);+ pos.width/2)
                // div.style.backgroundPosition = '50%';

                // TODO spring back nicely
                // setTimeout(() => {
                //     startX = 0;
                //     startY = 0;
                // },333);

                startX = e.layerX;
                startY = e.layerY;

            });
        }

        // Append to body here or return div?
        if (link) {
            let a = document.createElement('a');
            a.href = link;
            a.classList.add('link');
            //a.style.border = 'none';
            a.appendChild(div);

            a.addEventListener('click', e => {
                openPage(link);
            });

            return a;
        } else {
            return div;
        }
    } else {
        return false;
    }
}

