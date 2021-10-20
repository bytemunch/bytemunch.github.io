import { game, rs } from "../main.js";
import { audioMgr, timestep } from "./BallGame.js";
import { Particle } from "./Particle.js";
import { Vector } from "./Vector.js";
export class Ball {
    constructor(o) {
        this.pos = new Vector({ x: o.x, y: o.y });
        this.vel = new Vector({ a: o.a, m: 5 });
        this.size = 5;
        this.health = game.upgrades.bounces;
    }
    update() {
        this.pos.addV(this.vel.iMult(timestep));
        for (let o of game.gameObjects) {
            if (this.collide(o)) {
            }
            ;
        }
    }
    get left() {
        return this.pos.x - this.size;
    }
    get right() {
        return this.pos.x + this.size;
    }
    get top() {
        return this.pos.y - this.size;
    }
    get bottom() {
        return this.pos.y + this.size;
    }
    collide(o) {
        if (o == this)
            return;
        if (o.constructor.name == 'Ball')
            return;
        if (this.left < o.right &&
            this.right > o.left &&
            this.top < o.bottom &&
            this.bottom > o.top) {
            const prevPosition = {
                left: this.pos.x - this.vel.x * timestep - this.size,
                right: this.pos.x - this.vel.x * timestep + this.size,
                top: this.pos.y - this.vel.y * timestep - this.size,
                bottom: this.pos.y - this.vel.y * timestep + this.size,
            };
            const rightCollide = prevPosition.right < o.left && this.right >= o.left;
            const leftCollide = prevPosition.left >= o.right && this.left < o.right;
            const bottomCollide = prevPosition.bottom < o.top && this.bottom >= o.top;
            const topCollide = prevPosition.top >= o.bottom && this.top < o.bottom;
            if (o.constructor.name == 'Block' || o.constructor.name == 'Floor') {
                let b = o;
                const negateHealth = () => {
                    if (b.constructor.name == 'Floor') {
                        b.health -= 1n;
                    }
                    else {
                        b.health -= game.upgrades.ballDamage;
                        this.health--;
                    }
                    audioMgr.play((this.health > 0) ? 'bounce' : 'explosion2');
                    this.emitParticles(10);
                };
                if (leftCollide && b.collisionSides.left) {
                    this.vel.x *= -1;
                    negateHealth();
                }
                if (topCollide && b.collisionSides.top) {
                    this.vel.y *= -1;
                    negateHealth();
                }
                if (rightCollide && b.collisionSides.right) {
                    this.vel.x *= -1;
                    negateHealth();
                }
                if (bottomCollide && b.collisionSides.bottom) {
                    this.vel.y *= -1;
                    negateHealth();
                }
            }
            else {
                if (leftCollide || rightCollide)
                    this.vel.x *= -1;
                if (topCollide || bottomCollide)
                    this.vel.y *= -1;
                this.health--;
                this.emitParticles(10);
                audioMgr.play((this.health > 0) ? 'bounce' : 'explosion2');
            }
            if (this.health <= 0)
                this.emitParticles(10);
            return true;
        }
    }
    emitParticles(count) {
        for (let i = 0; i < count; i++) {
            game.particles.push(new Particle({ x: this.pos.x, y: this.pos.y }));
        }
    }
    draw(ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(rs(this.pos.x), rs(this.pos.y), rs(this.size), 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}
//# sourceMappingURL=Ball.js.map