var gridColor;
var title = "Faux3D Doodle";

let stars = new Array;
let cars = new Array;

let depth = 100;
let horizon = 400;

//-----------------BASIC STUFF--------------------------
function drawGrid() {
  //horizon = horizonSel.value();
  //gridlines; should be drawn first for background
  //stroke(gridColor.value());

  stroke('black');
  strokeWeight(2);
  line(0,horizon,width,horizon);

  //ground cols
  stroke('green');
  for (let x = 0; x < 20; x++) {
    line(x*(width/40),horizon,x*(width/20)-width/2,height);
  }
  for (let x = 0; x < 20; x++) {
    line(x*(width/40)+width/2,horizon,x*(width/20)+width/2,height);
  }

  //ground rows
  for (let x = 0; x < 20; x++) {
    let xpos = map(x,0,20,horizon,height);
    line(0,xpos,width,xpos);
  }

  //sky
  stroke('blue');
  for (let x = 0; x < 20; x++) {
    line(x*(width/40),horizon,x*(width/20)-width/2,0);
  }
  for (let x = 0; x < 20; x++) {
    line(x*(width/40)+width/2,horizon,x*(width/20)+width/2,0);
  }

  //sky rows
  for (let x = 0; x < 20; x++) {
    let xpos = map(x,0,20,0,horizon);
    line(0,xpos,width,xpos);
  }
}

function samSetup() {
  //inserts canvas to correct div in page
  cnv = createCanvas(window.innerWidth,window.innerHeight);
  cnv.parent('sketch');
  background(color('rgba(255,255,255,1)'));
/*
  //options for sketch
  var text = createP(title + ' | Options:');
  text.style('display', 'inline-block');
  text.parent('options');

  //options for sketch

  var gridColorTxt = createP(' GridColor:');
  gridColorTxt.style('display', 'inline-block');
  gridColorTxt.parent('options');

  gridColor = createSelect();
  gridColor.option('blue');
  gridColor.option('red');
  gridColor.option('green');
  gridColor.option('grey');

  gridColor.style('display', 'inline-block');
  gridColor.parent('options');
*/

}

function mouseWheel(event) {
  horizon += event.delta;
  return false;
}

function setup() {
  samSetup();
}

function draw() {
  background(50);
  drawGrid();

  if (frameCount%10 == 0) {
    for (let x=0; x<random(5); x++) {
      stars[stars.length] = new star(false,random(width),horizon,depth);
      cars[cars.length] = new star(true,random(width),height+20,depth);
    }
  }

  for (let x=stars.length-1; x>=0; x--) {
    stars[x].update(stars[x].z);
    stars[x].draw();
  }

  for (let x=cars.length-1; x>=0; x--) {
    cars[x].update(cars[x].z);
    cars[x].draw();
  }
}
