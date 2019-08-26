// Canvas setup
let frameCount = 0;
const frameRate = 30;

const rooturi = window.location.hostname;

const canvas = document.createElement('canvas');

canvas.style.position = 'absolute';
canvas.style.zIndex = 0;

let ctx = canvas.getContext("2d");

document.body.appendChild(canvas);

//data structures
let links = [];
let lineRunners = [];

async function getPage(page) {
    const res = await fetch('./pages/' + page + '.json')
    return res.json();
}

function reRange(val, min1, max1, min2, max2) {
    let percent = (val - min1) / (max1 - min1);

    let newVal = min2 + ((max2 - min2) * percent);

    return newVal;
}

let pages = {
    about: new Page('about'),
    funstuff: new Page('funstuff'),
    portfolio: new Page('portfolio'),
    home: new Page('home')
}; //TODO loopme

links.push(new Link("./img/about.png", "#about", "me"));
links.push(new Link("./img/work.png", "#portfolio", "work"));
links.push(new Link("./img/play.png", "#funstuff", "play"));

const scale = 1;

// variablesss
let width;
let height;
let linew;
let maxw;
let maxh;
let minw;
let minh;

// animationstuff
let drawLoopId;

addAllRunners();

// add linerunners whole page
function addAllRunners(cb) {
    let boxes = document.querySelectorAll('.linkbox');
    for (let box of boxes) {
        let bb = box.getBoundingClientRect();
        //modify to fit
        bb.width -= 2 * linew;
        bb.height -= 2 * linew;
        addRunners(bb, box);
    }
    if (cb) cb();
}

// add linerunners
function addRunners(pos, parent) {
    //x y w h 
    //TL UP
    lineRunners.push(new LineRunner(pos.x, pos.y, 'y', -1, parent));
    //TL L
    lineRunners.push(new LineRunner(pos.x, pos.y, 'x', -1, parent));
    //TR UP
    lineRunners.push(new LineRunner(pos.x + pos.width + linew, pos.y, 'y', -1, parent));
    //TR R
    lineRunners.push(new LineRunner(pos.x + pos.width + linew, pos.y, 'x', 1, parent));
    //BL DOWN
    lineRunners.push(new LineRunner(pos.x, pos.y + pos.height + linew, 'y', 1, parent));
    //BL L
    lineRunners.push(new LineRunner(pos.x, pos.y + pos.height + linew, 'x', -1, parent));
    //BR DOWN
    lineRunners.push(new LineRunner(pos.x + pos.width + linew, pos.y + pos.height + linew, 'y', 1, parent));
    //BR R
    lineRunners.push(new LineRunner(pos.x + pos.width + linew, pos.y + pos.height + linew, 'x', 1, parent));
}

setTimeout(() => {
    fadeIn([document.body], 0.05);
}, 150);

function resetCanvas() {
    console.log('cnvreset');
    
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.height = height;
    canvas.width = width;

    width > height ? linew = height * 0.01 : linew = width * 0.01;
    linew = Math.floor(linew);
    maxw = (width / 4) * scale;
    maxh = (height / 4) * scale;

    minw = (width / 6) * scale;
    minh = (height / 6) * scale;

    let oldHeader = document.querySelector('#header');
    if (oldHeader) oldHeader.parentElement.removeChild(oldHeader);

    // add title
    let headerWidth = width < height ? width * 0.7 : width * 0.55;
    let headerPos = {
        x: -linew * 2,
        y: -linew * 2,
        width: headerWidth,
        height: headerWidth * 0.1
    }
    let header = newDiv(headerPos, './img/home.png', '#home');

    document.body.appendChild(header);

    //set color
    header.firstChild.style.backgroundColor = 'white';
    //add class
    header.firstChild.classList.add('home');


    header.id = 'header'
    //remove overlay
    header.firstChild.removeChild(header.firstChild.firstChild);


    openPage(location.hash.replace('#', ''));
}

window.addEventListener('resize', resetCanvas);
document.addEventListener('DOMContentLoaded', resetCanvas);