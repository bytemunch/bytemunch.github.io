var gridColor;
var title = "New Project";

//-----------------BASIC STUFF--------------------------
function drawGrid() {
  //gridlines; should be drawn first for background
  stroke(gridColor.value());
  line(0,30,width,30);
  line(20,0,20,height);
  line(22,0,22,height);

  for (y=30;y<=height;y+=19) {
    line(0,y,width,y);
  }
  for (x=30;x<width;x+=19) {
    line(x,0,x,height);
  }
}

function samSetup() {
  //inserts canvas to correct div in page
  cnv = createCanvas(window.innerWidth,window.innerHeight);
  cnv.parent('sketch');
  background(color('rgba(255,255,255,1)'));

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
}

function setup() {
  samSetup();
}

function draw() {
  background(255);
  drawGrid();
}
