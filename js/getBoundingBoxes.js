function getBoundingBoxes() {
    var divs = document.querySelectorAll('.linkbox');
    var bbs = [];
    var divbb;
    for (var _i = 0, divs_1 = divs; _i < divs_1.length; _i++) {
        var div = divs_1[_i];
        divbb = div.getBoundingClientRect();
        var stripped = {
            x: divbb.x -= linew,
            y: divbb.y -= linew,
            width: divbb.width += linew,
            height: divbb.height += linew
        };
        bbs.push(stripped);
    }
    return bbs;
}
