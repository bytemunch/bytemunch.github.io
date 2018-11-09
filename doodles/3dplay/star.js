
let star = function(layer,x,y = horizon,z) {
  this.lifespan = depth;
  this.startx = x;

  this.size = 20;

  this.color = color(random(100,255));//random(255),random(255));

  this.layer = layer;

  this.z = z;
  this.zx = x;
  this.zy = y;

  this.die = function() {
    let index = stars.indexOf(this);
    if (index >= 0) {
      stars.splice(index, 1);
    } else {
      let index = cars.indexOf(this);
      cars.splice(index, 1);
    }
  }

  this.update = function(z) {

    this.z = depth-((this.lifespan-1)%depth);

    this.zx = map(z,0,depth,this.startx,this.startx+(this.startx-width/2));

    if (this.layer) {
      //draw to floor
      this.zy = map(z,0,depth,horizon,height+this.size*2);
      this.zscale = map(z,0,depth,0,1);
    } else {
      //draw to sky
      this.zy = map(z,0,depth,horizon,-this.size*2);
      this.zscale = map(z,0,depth,0,1);
    }

    if (this.lifespan <= 0) {
      this.die();
    }

    this.lifespan--;
  }

  this.draw = function() {
    if (frameCount%2) {
      stroke(this.color);
    } else {
      stroke(this.color);

      //stroke(255);
    }
    strokeWeight(3);
    noFill();
    ellipse(this.zx,this.zy,this.size*this.zscale,this.size*this.zscale);
  }
}
