export function getAnimatableBoxes() {
    let boxes = Array.from(document.querySelectorAll('.linkbox'));
    const main = document.querySelector('.main-div');
    if (main)
        boxes.push(main);
    boxes.splice(boxes.indexOf(document.querySelector('.home')), 1);
    return boxes;
}
