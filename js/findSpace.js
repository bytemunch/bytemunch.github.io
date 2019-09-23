function findSpace(maxw, minw, maxh, minh) {
    var overlap = true;
    var rw, rh, rx, ry, i = 0;
    while (overlap && i < 1000) {
        i++;
        rw = Math.random() * (maxw - minw) + minw;
        rh = Math.random() * (maxh - minh) + minh;
        rx = Math.floor(Math.random() * (width - rw - linew * 2));
        ry = Math.floor(Math.random() * (height - rh - linew * 2));
        overlap = false;
        var bbs = getBoundingBoxes();
        for (var _i = 0, bbs_1 = bbs; _i < bbs_1.length; _i++) {
            var bb = bbs_1[_i];
            var thisBb = { x: rx, y: ry, width: rw, height: rh };
            if (checkCollision(bb, thisBb)) {
                overlap = true;
                break;
            }
        }
    }
    if (i >= 1000) {
        return false;
    }
    return { x: rx, y: ry, width: rw, height: rh };
}
