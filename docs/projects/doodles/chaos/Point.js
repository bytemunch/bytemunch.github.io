class Point {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.w = 1;
        this.color = color || '#000';
    }

    getColor() {
        let r = 0, g = 0, b = 0, total = 0;

        for (let i = 0; i < seedPointCount; i++) {
            if (i % 3 === 0) {
                r += getDist(this, seedPoints[i]);

            } else if (i % 3 === 1) {
                g += getDist(this, seedPoints[i]);

            } else if (i % 3 === 2) {
                b += getDist(this, seedPoints[i]);
            }
        }

        total = r + g + b;

        // //color scheme 1
        // r=(1-(r/total))*255;
        // g=(1-(g/total))*255;
        // b=(1-(b/total))*255;

        //color scheme 2
        r = (r / total) * 255;
        g = (g / total) * 255;
        b = (b / total) * 255;

        // //color scheme 3
        // if (r>g && r>b) {
        //     r=255;
        //     g=0;
        //     b=0;
        // } else if (g>r && g>b) {
        //     r=0;
        //     g=255;
        //     b=0;
        // } else {
        //     r=0;
        //     g=0;
        //     b=255;
        // }

        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    draw() {
        if (this.color === '#000') {
            this.color = this.getColor();
        }
        ctx.fillStyle = this.color;

        ctx.fillRect(this.x, this.y, this.w, this.w);
        // ctx.beginPath();
        // ctx.arc(this.x,this.y,1, 0, 2 * Math.PI, true);
        // ctx.fill();
    }
}