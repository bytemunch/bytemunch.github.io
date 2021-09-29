var g = 9.8;
var ground = 10;
var seeds = [];
var plants = [];

function seed(x,y,index) {
  this.x = x;
  this.y = y;
  this.index = index;
  this.dead = false;

  this.update = function() {
    if (!this.dead) {
      this.y += g;
      if (this.y > height-ground) {
        plants.push(new plant(this));
        this.dead = true;
      } else if (this.y > height) {
        this.dead = true;
      }
    }
  }

  this.draw = function() {
    if (!this.dead) {
      fill(1);
      ellipse(this.x,this.y,2);
    }
  }
}

function plant(seed){
  this.x = seed.x;
  this.x2 = this.x;
  this.y2 = height-ground;

  this.branches = [];

  this.addBranch = function() {
    this.branches.push(new branch(this.branches[this.branches.length]));
  }

  this.update = function() {
    if (this.branches.length == 0) {
      this.branches.push(new branch(this));
    } else {
      for (i=0;i<this.branches.length;i++) {
        this.branches[i].update();
      }
    }
  }

  this.draw = function() {
    for (i=0;i<this.branches.length;i++) {
      this.branches[i].draw();
    }
  }
}

function branch(stem) {
  this.x = stem.x2;
  this.x2 = this.x;
  this.y = stem.y2;
  this.y2 = this.y;

  this.stems = [];

  this.update = function() {
    if (this.stems.length == 0) {
     this.stems.push(new segment(this));
   } else if (this.stems.length < 5) {

     this.stems.push(new segment(this.stems[this.stems.length-1]));
    }
  }

  this.draw = function() {
    for (i=0;i<this.stems.length;i++) {
      this.stems[i].draw();
    }
  }
}

function segment(stem) {
  this.x = stem.x2;
  this.y = stem.y2;
  this.x2 = this.x + random(-5,5);
  this.y2 = this.y - 15;

  this.draw = function() {
    stroke("green");
    line(this.x,this.y,this.x2,this.y2);
  }
}

function mouseClicked() {
  var index = seeds.length+1;
  seeds.push(new seed(mouseX,mouseY,index));
}

function setup() {
  //inserts canvas to correct div in page
  cnv = createCanvas(window.innerWidth,window.innerHeight);
  cnv.parent('sketch');
  background(color('rgba(255,255,255,1)'));

  //options
}

function draw() {
  background(255);

  for (i=0;i<seeds.length;i++) {
    seeds[i].update();
    seeds[i].draw();
  }

  for (j=0;j<plants.length;j++) {
    plants[j].update();
    plants[j].draw();
  }

  stroke('green');
  fill('green');
  rect(0,height-ground,width,height);

  //gridlines; should be drawn first for background
  stroke('rgba(128,128,128,0.3)');
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
