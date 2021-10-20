import { rs } from "../main.js";
import { Vector } from "./Vector.js";
export class Wall {
    constructor(o) {
        this.pos = new Vector({ x: o.x, y: o.y });
        this.width = o.width;
        this.height = o.height;
    }
    get left() {
        return this.pos.x;
    }
    get right() {
        return this.pos.x + this.width;
    }
    get top() {
        return this.pos.y;
    }
    get bottom() {
        return this.pos.y + this.height;
    }
    update() {
    }
    draw(ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(rs(this.pos.x), rs(this.pos.y), rs(this.width), rs(this.height));
    }
}
//# sourceMappingURL=Wall.js.map