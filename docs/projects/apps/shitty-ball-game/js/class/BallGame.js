import { bg, rh, rs2 } from "../main.js";
import { Block } from "./Block.js";
import { Wall } from "./Wall.js";
import { BallGun } from "./BallGun.js";
import { BallBank } from "./BallBank.js";
import { CashBank } from "./CashBank.js";
import { BounceUpgrade } from "./BounceUpgrade.js";
import { DamageUpgrade } from "./DamageUpgrade.js";
import { FloorUpgrade } from "./FloorUpgrade.js";
import { Floor } from "./Floor.js";
import { AudioManager } from "./AudioManager.js";
export const lowerGameBound = 500;
let deltaTime = 0;
export let prevFrameTime = 0;
export let timestep = 0;
export let frameCount = 0;
export const audioMgr = new AudioManager;
;
BigInt.prototype.toJSON = function (b) {
    return this.toString() + "n";
};
export class BallGame {
    constructor() {
        this.timeFactor = 1;
        this.level = 0;
        this.naturalGameBB = {
            x: 0,
            y: 0,
            width: 320,
            height: 568,
            interfaceTop: 504
        };
        this.upgrades = {
            cashDropped: 1,
            ballDamage: 1n,
            bounces: 2,
            floorHealth: 10n
        };
        this.containerDiv = document.querySelector('#ball-game');
        this.touchTarget = document.querySelector('#touch-target');
        this.pauseMenu = document.querySelector('#pause-menu');
        this.splashScreen = document.querySelector('#splash');
        this.cnv = document.createElement('canvas');
        this.cnv.id = 'game-canvas';
        this.ctx = this.cnv.getContext('2d');
        this.iCnv = document.createElement('canvas');
        this.iCnv.id = 'interface-canvas';
        this.iCtx = this.iCnv.getContext('2d');
        this.onResize();
        this.containerDiv.appendChild(this.cnv);
        this.containerDiv.appendChild(this.iCnv);
        window.addEventListener('resize', e => {
            this.onResize();
        });
        this.balls = [];
        this.walls = [];
        this.blocks = [];
        this.particles = [];
        this.interfaces = [];
        this.actionQueue = [];
        this.ballGun = new BallGun;
        const wallWidth = 10;
        this.walls = [
            new Wall({
                x: 0,
                y: 0,
                width: wallWidth,
                height: lowerGameBound
            }),
            new Wall({
                x: this.naturalGameBB.width - wallWidth,
                y: 0,
                width: wallWidth,
                height: lowerGameBound
            }),
            new Wall({
                x: 0,
                y: 0,
                width: this.naturalGameBB.width,
                height: wallWidth
            }),
        ];
        this.touchTarget.addEventListener('touchstart', e => {
            e.preventDefault();
            const x = e.touches[0].clientX - this.containerBB.x;
            const y = e.touches[0].clientY - this.containerBB.y;
            if (rs2(y) < this.naturalGameBB.interfaceTop) {
                const moveFn = e => {
                    e.preventDefault();
                    this.ballGun.setTarget(e.touches[0].clientX - this.containerBB.x, e.touches[0].clientY - this.containerBB.y);
                };
                moveFn(e);
                this.touchTarget.addEventListener('touchmove', moveFn);
                const upFn = e => {
                    e.preventDefault();
                    this.touchTarget.removeEventListener('touchmove', moveFn);
                    this.touchTarget.removeEventListener('touchend', upFn);
                    this.ballGun.fire(this.balls, this.ballBank.magSize);
                };
                this.touchTarget.addEventListener('touchend', upFn);
            }
            else {
                for (let i of this.interfaceObjects) {
                    if (i.pointCollides && i.pointCollides(x, y))
                        i.click();
                }
            }
        });
        this.touchTarget.addEventListener('mousedown', e => {
            e.preventDefault();
            const x = e.offsetX;
            const y = e.offsetY;
            if (rs2(y) < this.naturalGameBB.interfaceTop) {
                const moveFn = e => {
                    e.preventDefault();
                    this.ballGun.setTarget(e.offsetX, e.offsetY);
                };
                moveFn(e);
                this.touchTarget.addEventListener('mousemove', moveFn);
                const upFn = e => {
                    e.preventDefault();
                    this.touchTarget.removeEventListener('mousemove', moveFn);
                    this.touchTarget.removeEventListener('mouseup', upFn);
                    this.ballGun.fire(this.balls, this.ballBank.magSize);
                };
                this.touchTarget.addEventListener('mouseup', upFn);
            }
            else {
                for (let i of this.interfaceObjects) {
                    if (i.pointCollides && i.pointCollides(x, y))
                        i.click();
                }
            }
        });
        this.pauseMenu.querySelector('#resume').addEventListener('click', this.unpause.bind(this));
        this.pauseMenu.querySelector('#save-quit').addEventListener('click', this.btnSaveQuit.bind(this));
        this.splashScreen.querySelector('#play').addEventListener('click', this.startGame.bind(this));
        this.splashScreen.querySelector('#clear-data').addEventListener('click', this.btnClearData.bind(this));
        this.containerDiv.querySelectorAll('.audio-toggle').forEach(e => e.addEventListener('click', this.btnToggleAudio.bind(this)));
    }
    postInit() {
        this.ballBank = new BallBank({ x: 256 });
        this.cashBank = new CashBank({ x: 16 });
        this.bounceUpgrade = new BounceUpgrade({ x: 82 });
        this.damageUpgrade = new DamageUpgrade({ x: 136 });
        this.floorUpgrade = new FloorUpgrade({ x: 190 });
        this.loadData();
        this.loopHandle = requestAnimationFrame(this.loop.bind(this));
    }
    async loadLevel() {
        if (this.loading)
            return;
        this.loading = true;
        this.saveData();
        this.blocks = [];
        this.balls.forEach(b => b.health = 0);
        this.actionQueue = [];
        this.ballGun.firing = false;
        let levelsPerDifficulty = {
            easy: 3,
            medium: 2,
            hard: 1,
            bonus: 1
        };
        let levelsInDifficulty = {
            easy: 2,
            medium: 2,
            hard: 1,
            bonus: 1
        };
        let levelRotation = levelsPerDifficulty.easy + levelsPerDifficulty.medium + levelsPerDifficulty.hard + levelsPerDifficulty.bonus;
        let rotationProgress = this.level % levelRotation;
        let difficulty = 'easy';
        if (rotationProgress >= levelsPerDifficulty.easy) {
            difficulty = 'medium';
        }
        if (rotationProgress >= levelsPerDifficulty.easy + levelsPerDifficulty.medium) {
            difficulty = 'hard';
        }
        if (rotationProgress >= levelsPerDifficulty.easy + levelsPerDifficulty.medium + levelsPerDifficulty.hard) {
            difficulty = 'bonus';
        }
        let lvl = Math.floor(1 + Math.random() * levelsInDifficulty[difficulty]);
        let scaling = Math.ceil(this.level / levelRotation) || 1;
        let levelLoaded = new Promise(res => {
            let ocnv = document.createElement('canvas');
            let octx = ocnv.getContext('2d');
            let oimg = new Image();
            oimg.onload = () => {
                octx.drawImage(oimg, 0, 0);
                let imgData = octx.getImageData(0, 0, 10, 10);
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 10; j++) {
                        let channelMix = imgData.data[(10 * j * 4 + i * 4)] + imgData.data[(10 * j * 4 + i * 4) + 1] + imgData.data[(10 * j * 4 + i * 4) + 2];
                        let bh = BigInt(Math.ceil(scaling * 100 * (channelMix / (255 * 3))));
                        this.blocks.push(new Block({ x: bg(i), y: bg(j), health: bh }));
                    }
                }
                this.blocks.push(new Floor());
                res(0);
            };
            oimg.src = `./levels/${difficulty}/${lvl}.png`;
        });
        await levelLoaded;
        this.loading = false;
        audioMgr.play('level');
        return;
    }
    parseBigInts(o) {
        const regex = str => str.match(/^\d*n$/) != undefined;
        const deepSearch = (o) => {
            for (let prop in o) {
                if (typeof o[prop] == 'string' && regex(o[prop])) {
                    o[prop] = BigInt(o[prop].slice(0, o[prop].length - 1));
                    continue;
                }
                if (typeof o[prop] == 'object') {
                    deepSearch(o[prop]);
                    continue;
                }
            }
            return o;
        };
        return deepSearch(o);
    }
    clearData() {
        const emptySaveData = {
            upgrades: {
                cashDropped: 1,
                ballDamage: 1n,
                bounces: 2,
                floorHealth: 10n
            },
            balls: 200n,
            cash: 0n,
            level: 0
        };
        localStorage.setItem('save-data', JSON.stringify(emptySaveData));
        this.loadData();
        console.log(this.parseBigInts(JSON.parse(JSON.stringify(emptySaveData))));
    }
    saveData() {
        const saveData = {
            upgrades: this.upgrades,
            balls: this.ballBank.count,
            cash: this.cashBank.count,
            level: this.level
        };
        localStorage.setItem('save-data', JSON.stringify(saveData));
    }
    loadData() {
        const data = this.parseBigInts(JSON.parse(localStorage.getItem('save-data')));
        if (data) {
            this.upgrades = data.upgrades;
            this.ballBank.count = data.balls;
            this.cashBank.count = data.cash;
            this.level = data.level;
            this.loadLevel();
        }
        else {
            this.clearData();
        }
    }
    btnToggleAudio() {
        if (audioMgr.muted) {
            document.querySelectorAll('.audio-toggle').forEach(e => e.classList.remove('disabled'));
            audioMgr.muted = false;
        }
        else {
            document.querySelectorAll('.audio-toggle').forEach(e => e.classList.add('disabled'));
            audioMgr.muted = true;
        }
    }
    btnClearData() {
        audioMgr.play('click');
        this.clearData();
        console.log('data cleared!');
    }
    btnSaveQuit() {
        audioMgr.play('click');
        this.saveData();
        console.log('saved, now quit.');
        this.splashScreen.style.display = 'block';
        this.pauseMenu.style.display = 'none';
    }
    async startGame() {
        this.splashScreen.style.display = 'none';
        await audioMgr.init();
        this.unpause();
    }
    pause() {
        audioMgr.play('click');
        for (let fn of this.actionQueue) {
            fn.trigger += 10000000000;
        }
        const decreaseTimeFactor = () => {
            this.timeFactor *= 0.9;
            if (this.timeFactor > 0.1) {
                this.actionQueue.push({ trigger: 0, cb: decreaseTimeFactor });
            }
            else {
                this.timeFactor = 0;
            }
            ;
        };
        decreaseTimeFactor();
        this.pauseMenu.style.display = 'block';
    }
    unpause() {
        audioMgr.play('click');
        this.pauseMenu.style.display = 'none';
        for (let fn of this.actionQueue) {
            fn.trigger -= 10000000000 + prevFrameTime;
        }
        this.timeFactor = 0.1;
        const increaseTimeFactor = () => {
            this.timeFactor *= 1.1;
            if (this.timeFactor < 1) {
                this.actionQueue.push({ trigger: 0, cb: increaseTimeFactor });
            }
            else {
                this.timeFactor = 1;
            }
            ;
        };
        increaseTimeFactor();
    }
    async advert() {
        let countdown = 5;
        const adDiv = this.containerDiv.querySelector('#advert');
        const adTxt = adDiv.querySelector('#countdown');
        adDiv.style.display = 'block';
        audioMgr.play('lose');
        let adProm = new Promise((res) => {
            let ivl = setInterval(() => { countdown--; adTxt.textContent = `Skipping in ${countdown}...`; if (countdown <= 0) {
                clearInterval(ivl);
                res(1);
            } }, 1000);
        });
        await adProm;
        adDiv.style.display = 'none';
        adTxt.textContent = `Skipping in 5...`;
        return;
    }
    onResize() {
        this.containerBB = this.containerDiv.getBoundingClientRect();
        this.iCnv.width = this.containerBB.width;
        this.iCnv.height = this.containerBB.height;
        this.cnv.width = this.containerBB.width;
        this.cnv.height = this.containerBB.height;
        rh.ratio = this.containerBB.width / this.naturalGameBB.width;
    }
    get allObjects() {
        return [...this.walls, ...this.blocks, ...this.balls, this.ballGun];
    }
    get interfaceObjects() {
        return [this.ballBank, this.cashBank, this.bounceUpgrade, this.damageUpgrade, this.floorUpgrade, ...this.interfaces];
    }
    get gameObjects() {
        return [...this.walls, ...this.blocks, ...this.balls];
    }
    queue(ms, cb, args) {
        const trigger = prevFrameTime + ms * (1 / this.timeFactor);
        this.actionQueue.push({ trigger, cb, args });
    }
    async loop(t) {
        frameCount++;
        deltaTime = (t - prevFrameTime) / 20;
        timestep = deltaTime * this.timeFactor;
        prevFrameTime = t;
        if (this.blocks.length == 1 && this.blocks[0].constructor.name == 'Floor')
            this.blocks = [];
        if (!this.loading && this.blocks.length == 0) {
            this.level++;
            await this.loadLevel();
        }
        for (let i = this.actionQueue.length - 1; i >= 0; i--) {
            let fn = this.actionQueue[i];
            if (fn.trigger < prevFrameTime) {
                fn.cb(fn.args);
                this.actionQueue.splice(i, 1);
            }
        }
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.iCtx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (let i = this.balls.length - 1; i >= 0; i--) {
            if (this.balls[i].pos.y > lowerGameBound || this.balls[i].pos.y < 0 || this.balls[i].health <= 0) {
                this.balls.splice(i, 1);
            }
        }
        for (let i = this.blocks.length - 1; i >= 0; i--) {
            if (this.blocks[i].health <= 0) {
                this.blocks[i].die();
                this.blocks.splice(i, 1);
            }
        }
        for (let i = this.interfaces.length - 1; i >= 0; i--) {
            if (this.interfaces[i].dead) {
                this.interfaces.splice(i, 1);
                continue;
            }
            this.interfaces[i].update();
        }
        for (let o of this.allObjects) {
            o.update();
        }
        for (let i of this.interfaceObjects) {
            i.draw(this.iCtx);
        }
        for (let o of this.gameObjects) {
            o.draw(this.ctx);
        }
        this.ballGun.draw(this.ctx);
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.update();
            if (p.dead) {
                this.particles.splice(i, 1);
                continue;
            }
            p.draw(this.ctx);
        }
        requestAnimationFrame(this.loop.bind(this));
    }
}
//# sourceMappingURL=BallGame.js.map