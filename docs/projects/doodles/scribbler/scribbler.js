function ant(x,y,lifespan) {
  this.r = 3;

  this.pos = new p5.Vector(x,y);
  this.vel = new p5.Vector();
  this.trail = new p5.Vector();
  this.target = new p5.Vector(400,100);

  this.speed = 6;

  //this.color=color(0);
  this.color = color(random(128,255),random(128,255),random(128,255));

  this.lifespan = lifespan;

  this.die = function() {
    var index = ants.indexOf[this];
    ants.splice(index,1);
  }

  this.update = function() {
    this.lifespan--;

    if (mouseX >= 0 &&
    mouseX <= width &&
    mouseY >= 0 &&
    mouseY <= height) {
      this.target.x = mouseX;
      this.target.y = mouseY;
    } else {
      this.target.x = 0;
      this.target.y=0;
    }


    this.trail = this.pos.copy();

    if (!this.lifespan || this.pos.x > width || this.pos.y > height) {
      this.die();
    }

    //movement

    if (this.target.x || this.target.y) {
      var dx = this.pos.x - this.target.x;
      var dy = this.pos.y - this.target.y;

      var diff = new p5.Vector(dx,dy);

      var angle = diff.heading();


      //console.log(angle);

      this.vel.rotate(-this.vel.heading());
      this.vel.rotate(PI + angle);
      this.vel.rotate(random(-0.5,0.5));

      this.vel.add(1);
    } else {
      this.vel.x += random(-1,1);
      this.vel.y += random(-this.vel.x,this.vel.x);
    }

    this.vel.normalize();
    this.pos.add(this.vel.mult(this.speed));
  }

  this.draw = function() {
    stroke(0);
    if (this.trail.x !== 0 && this.trail.y !== 0) { //prevent sudden straight line bug
      trails[trails.length] = new trail(this.trail.x,this.trail.y,this.pos.x,this.pos.y,this.color)
      //line(this.trail.x,this.trail.y,this.pos.x,this.pos.y);
      stroke(255,0,0);
      //ellipse(this.pos.x,this.pos.y,this.r);
    }
  }
}

function trail(x1,y1,x2,y2,color=0) {
  this.o = 255;

  this.color = color;

  this.rng = new Array();

  for (var r = 0; r<7;r++) {
    this.rng[this.rng.length] = new p5.Vector(random(x1,x2),random(y1,y2));
  }

  this.die = function() {
    var index = trails.indexOf[this];
    trails.splice(index,1);
  }

  this.draw = function() {
    if (this.o <= 0) {
      this.die();
    }

    this.o-=4;
    stroke(this.color);
    //ellipse(x1,y1,x2,y2); //tRiPpY
    for (var c=0;c<this.rng.length;c++) {
      point(this.rng[c].x, this.rng[c].y);
    }

    //line(x1,y1,x2,y2);
  }
}

var ants = new Array();
var trails = new Array();

function addAnt() {
  ants.push(new ant(random(width),random(height),180));
}

function setup() {
  cnv = createCanvas(window.innerWidth,window.innerHeight);
  cnv.parent('scribbles');
  background(color('rgba(255,255,255,1)'));
}

function draw() {
  background(255);

  for (x=0;x<ants.length;x++) {
    ants[x].update();
    if (ants[x]) {
      ants[x].draw();
    }
  }

  for (x=0;x<trails.length;x++) {
    if (trails[x]) {
      trails[x].draw();
    }
  }

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

  if (random(-50,2) > 0) {
    addAnt();
  }
}
