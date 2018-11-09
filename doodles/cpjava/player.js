//player object

function Player() {
  this.pos = new p5.Vector(0,height*0.9);
  this.w = width/16;
  this.h = height/10;
  this.maxheld = 8;

  this.color = color(0);

  this.held = new Array;

  this.checkCollision = function(target) {
    stackHeight=0;
    if (this.held.length) {
      stackHeight = this.held.length*this.held[0].h;
    }
    if (this.pos.x - this.w/2 <= target.pos.x - target.w/2 &&
    this.pos.x + this.w/2 >= target.pos.x + target.w/2 &&
    this.pos.y - this.w/2 - stackHeight <= target.pos.y - target.h/2 ) {
      this.collect(target);
    }
  }

  this.collect = function(target) {
    this.held[this.held.length] = target;
    target.g = new p5.Vector(0,0);
    target.vel = new p5.Vector(0,0);
    target.die();
  }

  this.deposit = function() {
    if (this.pos.x > width * 0.9) {
      if (this.held.length > 0) {
        this.held.splice(this.held.length-1,1);
        score++;
      }
    }
  }

  this.update = function() {
    //follow mouse
    this.pos.x = mouseX;

    //constrain within play area
    if (this.pos.x >= width*0.95) {
      this.pos.x = width*0.95
    }

    if (this.pos.x <= width*0.05) {
      this.pos.x = width*0.05
    }

    //check collision with all items on screen
    for (let x = items.length; x > 0; x--) {
      this.checkCollision(items[x-1]);
    }

    //position and draw carried stack
    for (let x = this.held.length; x > 0; x--) {
      let item = this.held[x-1];
      item.pos.set(this.pos.x, this.pos.y - this.h/4 - item.h*x);
      this.held[x-1].draw();
    }

    //change color depending on max held
    let strain = map(this.held.length,0,this.maxheld,0,255);
    this.color = color(strain, 0, 0);

    //one from dying, blink
    if (this.held.length == this.maxheld) {
      if (frameCount%60 > 30) {
        this.color = color(0);
      } else {
        this.color = color('red');
      }
    }

    //if holding too many then die
    if (this.held.length > this.maxheld) {
      lives = 0;
    }
  }

  this.draw = function() {
    stroke(0);
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.w, this.h);
  }
}
