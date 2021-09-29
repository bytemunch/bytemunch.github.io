var gridColor;
var title = "TestTextureRender";

let texstr = "44 44 FF FF FF FF FF FF 00 0F FF 0F 02 0F 51 00 FF FF FF FF FF FF FF FF F0 08 0F 80 C0 49 CF 8E 02 00 EF 37 FF FF FF FF F1 00 FF EF 80 00 85 20 FF FF FF FF FF FF FF FF 10 CA EE 06 B4 02 7A 26 FF FF FF FF FF FF FF FF BE BB 70 77 03 21 EF A0 FF FF FF FF FF FF FF FF 88 BB 33 73 07 13 E7 89 FF FF FF FF FF FF FF FF BE EE C0 EE 74 31 CA 85 FF FF FF FF FF FF FF FF EE EE EE EE B2 16 A6 54 FF FF FF FF FF FF FF FF 44 77 FF FF 09 04 DE 7A FF FF FF FF FF FF FF FF 8B 88 00 22 0D 01 CB 56 FF FF FF FF FF FF FF FF CC CC EE EE D9 04 7B 26 FF FF FF FF FF FF FF FF CC CC EE EE D9 04 7B 26 FF FF FF FF FF FF FF FF 88 38 33 73 6F 11 D5 51 FF FF FF FF FF FF FF FF EE 98 67 46 05 12 AB 24 FF FF FF FF FF FF FF FF EE EE FE EE 8A 00 8C 2C FF FF FF FF FF FF FF FF 22 22 EE EE 53 03 6F 08 FF FF FF FF FF FF FF FF AA 07 77 0F 24 34 BC 46 FF FF FF FF FF FF FF FF F0 FF FF FF D8 44 CB 65 FF FF FF FF FF FF FF FF 9F F6 3F 00 8A 22 A2 4B FF FF FF FF FF FF FF FF F3 FF FC FF 58 05 7B 26 FF FF FF FF FF FF FF FF F0 00 FF FF 4C 00 43 00 BB AB 44 34 11 00 00 00 F0 FF FF 0F FE 33 48 33 FF FF FF FF FF FF FF FF CC CC FC FF 2B 00 2B 00 99 56 23 12 00 00 00 00 FC FF FF 0F 9C 05 25 05";

let texstr2 = "00 00 00 80 00 F8 40 FF 7F 13 80 EE FE 47 78 47 70 FF B0 FF A0 FF 90 FF DD DD EE EE F3 40 7A 38 30 44 FF FF FF FF FF FF CD 0C FE FF E7 2C 84 2C FF FF FF FF FF FF FF FF FD 1B 1F 11 91 25 AD 5A B0 FF D0 FF D0 FF B0 FF 33 33 EE EE E5 60 E5 60 A0 FF 90 FF 90 FF 90 FF 33 33 EE EE E5 60 E5 60 FF FF FF FF FF FF FF FF C4 8C 99 99 E1 03 8E 4A FF FF FF FF FF FF FF FF 9B 99 99 D9 65 03 8E 3A 80 FF 50 FF 40 FF 40 FF 33 33 EE EE E5 60 E5 60 40 FF 20 FF 00 FF 00 FF 11 73 EE EE E5 40 45 40 FF FF FF FF FF FF FF FF 57 55 11 33 49 02 7C 28 FF FF FF FF FF FF FF FF 11 11 BB FB 8D 04 8D 28 00 FF 00 FF 00 FF 00 FE 77 77 EE EE E5 70 75 70 00 FE 00 FD 00 FD 00 FD FB FF 66 66 E1 70 74 70 FF FF FF FF FF FF FF FF DD 9D 11 D1 25 02 6B 06 FF FF FF FF FF FF FF FF 55 55 FF 7F 25 02 6B 15 00 FC 00 FB 00 F9 00 F9 BB FF 66 66 E1 70 74 70 00 F8 00 F7 00 F4 00 F4 77 F7 66 EE E9 70 74 70 FF FF FF FF FF FF FF FF 22 E6 55 55 0D 03 5B 05 FF FF FF FF FF FF FF FF 08 10 F3 FF 8A 02 6E 16 00 F2 00 E0 00 80 00 00 73 F7 EE EE FD 73 75 70 00 00 00 00 00 00 00 00 FF FF EE 0E FD 55 55 55 FF FF FF FF FF FF E9 FF C0 CC C4 DC 05 00 23 00 41 B8 10 32 00 00 00 00 F3 FF F7 0F 3C 05 15 05";

let texarrays = new Array;

texarrays.push(texstr.split(" "));

texarrays.push(texstr2.split(" "));

const size = 10;

//-----------------BASIC STUFF--------------------------
function drawGrid() {
  push();
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
  pop();
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

  let z = 0;

  let cols = 8;
  let rows = 16;

  for (let ix=0; ix < texarrays.length; ix++) {
    z=0;
    for (let iy=0; iy < 1; iy++) {
      for (let x=0; x < cols; x++) {
        for (let y=0; y < rows; y++) {
          if (true){//texarray[z+3] != null) {
            stroke(0);
            fill(parseInt(texarrays[ix][z],16),parseInt(texarrays[ix][z+1],16),parseInt(texarrays[ix][z+2],16));
            rect((x*size)+(cols*ix*size),(y*size)+(rows*iy*size),size,size);
            z+=3;
          }
        }
      }
    }
  }

    /*
    color(texarray[x]);
    stroke(texarray[x]);
    rect(x*size,0,x*size+size,size);
    */

}
