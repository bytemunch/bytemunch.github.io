//player object

function Item(vel) {
  this.pos = new p5.Vector(0,height*0.8);
  this.vel = vel; //new p5.Vector(1,-5);
  this.g = new p5.Vector(0, 0.09);
  this.score = 1;
  this.color = color('red');

  this.w = width/40;
  this.h = height/25;

  this.die = function() {
    let index = items.indexOf(this);
    items.splice(index, 1);
  }

  this.update = function() {
    this.pos.add(this.vel);
    this.vel.add(this.g);

    if (this.pos.y > height*0.95) {
      this.vel = this.g = new p5.Vector(0,0);
      this.pos.y = height*0.949;
      dropped[dropped.length] = this;
      this.die();
      lives--;
    }
  }

  this.draw = function() {
    stroke(0);
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.w, this.h);
  }

}
