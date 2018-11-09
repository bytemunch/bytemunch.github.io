function getBoundingBoxes() {
    let divs = document.querySelectorAll('.linkbox');
    let bbs = [];
    let divbb;


    for (let div of divs) {
        divbb = div.getBoundingClientRect();
        let stripped = {
            x: divbb.x -= linew,
            y: divbb.y -= linew,
            width: divbb.width += linew,
            height: divbb.height += linew
        };
        bbs.push(stripped);
    }

    return bbs;
}