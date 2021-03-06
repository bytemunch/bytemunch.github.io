function newDiv(pos, img, link, txt) {
    var div = document.createElement('div');
    var color = '';
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
    div.classList.add('linkbox');
    if (txt) {
        var title = document.createElement('h2');
        title.textContent = txt.toUpperCase();
        title.className = 'linktext';
        title.style.fontSize = '0';
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
        var overlay = document.createElement('div');
        overlay.style.width = '150%';
        overlay.style.height = '150%';
        overlay.classList.add('overlay');
        overlay.style.backgroundColor = color;
        overlay.style.opacity = '0.5';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        div.appendChild(overlay);
        div.style.backgroundImage = "url('" + img + "')";
        div.style.backgroundPositionX = 'center';
        div.addEventListener('mousemove', function (e) {
            var newPos = (e.layerX / Number(div.style.width.replace('px', ''))) * 100;
            newPos = reRange(newPos, 0, 100, 40, 60);
            div.style.backgroundPositionX = newPos + '%';
        });
        div.addEventListener('mouseout', function (e) {
        });
    }
    if (link) {
        var a = document.createElement('a');
        a.href = link;
        a.classList.add('link');
        a.appendChild(div);
        a.addEventListener('click', function (e) {
            openPage(link);
        });
        return a;
    }
    else {
        return div;
    }
}
