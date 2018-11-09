var eg;
var optdiffstart;
var optdiffmult;

let playing = false;

var title = "ClubPenguinBeansGameCopy";
let player;
let items = new Array;
let dropped = new Array;
let difficulty;
let score = 0;
let lives = 5;

//-----------------PRESETUP STUFF--------------------------
function drawGrid() {
  //gridlines; should be drawn first for background
  stroke(eg.value());
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
  cnv = createCanvas(800,500);
  cnv.parent('sketch');
  background(color('rgba(255,255,255,1)'));

  //options for sketch
  var text = createP(title + ' | Options:');
  text.style('display', 'inline-block');
  text.parent('options');

  let egtext = createP(' | GridColor:');
  egtext.style('display', 'inline-block');
  egtext.parent('options');

  eg = createSelect();
  eg.option('grey');
  eg.option('blue');
  eg.option('red');
  eg.option('green');
  eg.style('display', 'inline-block');
  eg.parent('options');


  let dstext = createP(' | StartDifficulty:');
  dstext.style('display', 'inline-block');
  dstext.parent('options');

  optdiffstart = createSelect();
  optdiffstart.option('100');
  optdiffstart.option('200');
  optdiffstart.option('300');
  optdiffstart.option('400');
  optdiffstart.style('display', 'inline-block');
  optdiffstart.parent('options');

  let dmtext = createP(' | DifficultyMultiplier:');
  dmtext.style('display', 'inline-block');
  dmtext.parent('options');

  optdiffmult = createSelect();
  optdiffmult.option('1');
  optdiffmult.option('2');
  optdiffmult.option('3');
  optdiffmult.option('4');
  optdiffmult.style('display', 'inline-block');
  optdiffmult.parent('options');
}
//------------------------------------------------------

function mouseClicked() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (playing) {
      player.deposit();
    } else {
      playing = true;
    }
  }
}

function setup() {
  samSetup();
  difficulty = optdiffstart.value();
  player = new Player();

  textAlign(CENTER,CENTER);
}

function draw() {

  if (playing && lives > 0) { //ingame
    background(255);
    drawGrid();

    if (frameCount%difficulty === 0) {
      let vel = new p5.Vector(random(1,3.5),random(-5,-8));
      items[items.length] = new Item(vel);
      difficulty = optdiffstart.value() - score*optdiffmult.value();
    }

    player.update();
    player.draw();

    for (let x = items.length; x > 0; x--) {
      items[x-1].draw();
      items[x-1].update();
    }

    for (let x = dropped.length; x > 0; x--) {
      dropped[x-1].draw();
      dropped[x-1].update();
    }

    fill(0);
    textSize(10);
    text(score,10,10);
    text(lives,width-10,10);
    text(frameCount,width/2,10);

  } else if (lives <= 0) { //dead
    background('red');
    drawGrid();

    textSize(100);
    text('GAME OVER',width/2,height/2-50);
    textSize(80);
    text('Score:'+score,width/2,height/2+50);

  } else { //before playing
    background('green');
    drawGrid();

    textSize(100);
    text('Click to start!',width/2,height/2-50);
  }
}
