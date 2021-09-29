// Chaos Game attempt 1

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;

let seedPoints = [];
let usedPoints = [];
let currentPoint;

let pointDistance = 0.5;

const seedPointCount = 5;

let avoidVerts = [];
let avoidAmt = 1;

function onLoad() {
    canvas.height = height;
    canvas.width = width;

    document.body.appendChild(canvas);

    // BEGIN!

    setSeedPoints(seedPointCount);

    startDrawLoop();
}

function getRand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getDist(p1, p2) {
    let a, b;
    a = Math.abs(p1.x - p2.x);
    b = Math.abs(p1.y - p2.y);

    return (Math.sqrt(a ^ 2 + b ^ 2));
}


function setSeedPoints(amt) {
    //set magnitiude for shape
    let mag;
    width > height ? mag = height * 0.4 : mag = width * 0.4;

    for (let i = 0; i < amt; i++) {
        let a = (i * Math.PI * 2) / amt;
        ax = width / 2 + Math.floor(Math.cos(a) * mag);
        ay = height / 2 + Math.floor(Math.sin(a) * mag);
        seedPoints.push(new Point(ax, ay))
    }

    currentPoint = randomPointInShape();

}

function randomPointInShape() {
    rx = getRand(0, width * 0.8);
    ry = getRand(0, height * 0.8);
    return new Point(rx, ry, '#F0F');
}

function pickTarget(avoiding) {
    let pick = Math.floor(Math.random() * seedPointCount);
    if (avoiding.indexOf(pick) !== -1) {
        return pickTarget(avoiding);
    } else {
        return pick;
    }
}

function addHalfwayPoint(target) {
    let newPos = lerpy(currentPoint, target, pointDistance);

    let newPoint = new Point(newPos[0], newPos[1]);
    //usedPoints.push(currentPoint);
    currentPoint = newPoint;
}

// SAM this is why you need code comments what the hell is this
// from 8 months ago ToT

function findHalf(p1, p2) {
    let nx, ny;
    p1.x < p2.x ? nx = ((p2.x - p1.x) / 2) + p1.x : nx = ((p1.x - p2.x) / 2) + p2.x;
    p1.y < p2.y ? ny = ((p2.y - p1.y) / 2) + p1.y : ny = ((p1.y - p2.y) / 2) + p2.y;

    return [nx, ny];
}

function lerpy(p1, p2, amt) {
    let nx, ny;
    p1.x < p2.x ? nx = ((p2.x - p1.x) * amt) + p1.x : nx = ((p1.x - p2.x) * amt) + p2.x;
    p1.y < p2.y ? ny = ((p2.y - p1.y) * amt) + p1.y : ny = ((p1.y - p2.y) * amt) + p2.y;

    return [nx, ny];
}

function startDrawLoop() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    function rAFDraw(ts) {
        if (seedPoints[0]) {

            for (let i = 0; i < 1000; i++) {

                for (let point of seedPoints) {
                    point.draw();
                }



                currentPoint.draw();
                //pick target seed point
                //add new point between current and target
                let target = pickTarget(avoidVerts);
                avoidVerts.push(target);

                if (avoidVerts.length > avoidAmt) {
                    avoidVerts.splice(0,1);
                }

                addHalfwayPoint(seedPoints[target]);
                //make new point current and move current to used

            }

            window.requestAnimationFrame(rAFDraw);
        }
    }
    window.requestAnimationFrame(rAFDraw);
}


