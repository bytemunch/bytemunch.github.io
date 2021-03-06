function sizeText(text, maxWidth, maxHeight) {
    document.querySelector("#invisible").appendChild(text);
    var bb = text.getBoundingClientRect();
    var currentWidth = bb.width;
    var currentHeight = bb.height;
    var currentSize;
    text.style.fontSize ? currentSize = parseInt(text.style.fontSize, 10) : currentSize = 0;
    if (maxWidth > currentWidth && maxHeight > currentHeight) {
        text.style.fontSize = 1 + currentSize;
        return sizeText(text, maxWidth, maxHeight);
    }
    else {
        return currentSize;
    }
}
