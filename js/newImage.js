function newImage(x, y, w, h, src, link) {
    var image = document.createElement('img');
    if (src[0] == '.') {
        image.src = src;
    }
    else {
        image.style.backgroundColor = src;
    }
    image.style.position = 'absolute';
    image.style.left = x;
    image.style.top = y;
    image.style.width = w;
    image.style.height = h;
    image.style.borderStyle = 'solid';
    image.style.borderWidth = linew;
    image.style.zIndex = '1';
    lineRunners.push(new LineRunner(x, y, 'y', -1));
    lineRunners.push(new LineRunner(x, y, 'x', -1));
    lineRunners.push(new LineRunner(x + w + linew, y, 'y', -1));
    lineRunners.push(new LineRunner(x + w + linew, y, 'x', 1));
    lineRunners.push(new LineRunner(x, y + h + linew, 'y', 1));
    lineRunners.push(new LineRunner(x, y + h + linew, 'x', -1));
    lineRunners.push(new LineRunner(x + w + linew, y + h + linew, 'y', 1));
    lineRunners.push(new LineRunner(x + w + linew, y + h + linew, 'x', 1));
    return image;
}
