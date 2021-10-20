import { xpToCurrentLevel, xp, coins, startGame, inventory, UIElements, sprites, pickup, extraActors, levelManifest, xpBoundaryForLevel, tool, tools, nextTool, layers, LAYERNUMBERS, clearLayer, camera } from "../main.js";
import { Item } from "./Item.js";
import { Coin, ItemDrop } from "./Drop.js";
const zIdxs = {
    screen: 10,
    screenChild: 20
};
export class UIElement {
    constructor(opts) {
        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;
        this.layer = LAYERNUMBERS.ui;
        this.z = 0;
        this.removeNextDraw = false;
        for (let o in opts) {
            this[o] = opts[o];
        }
        this.updatePosition();
    }
    updatePosition() {
        if (this.centerX) {
            this.left = layers[this.layer].cnv.width / 2 - this.width / 2;
        }
        else if (this.right != undefined) {
            this.left = layers[this.layer].cnv.width - this.right - this.width;
        }
        if (this.centerY) {
            this.top = layers[this.layer].cnv.height / 2 - this.height / 2;
        }
        else if (this.bottom != undefined) {
            this.top = layers[this.layer].cnv.height - this.bottom - this.height;
        }
    }
    act() {
        if (!this.interactable)
            return;
        console.log('Action not implemented!', this);
    }
    draw() {
        let ctx = layers[this.layer].ctx;
        ctx.drawImage(this.img, this.left, this.top, this.width, this.height);
    }
    clear() {
        let ctx = layers[this.layer].ctx;
        ctx.clearRect(this.x, this.y, this.width, this.height);
    }
    destroy() {
        UIElements.splice(UIElements.indexOf(this), 1);
    }
    get ctx() {
        return layers[this.layer].ctx;
    }
    get cnv() {
        return layers[this.layer].cnv;
    }
    get img() {
        try {
            return this.sprite.cnv;
        }
        catch (e) {
            console.error('sprite_not_found : ' + this.type, e);
        }
    }
    get x() {
        return this.left;
    }
    get y() {
        return this.top;
    }
    collidePoint(x, y) {
        return (x > this.x && y > this.y && x < this.x + this.width && y < this.y + this.height);
    }
}
const openScreen = (screen) => {
    let el = screenIsOpen();
    if (el)
        el.removeNextDraw = true;
    UIElements.push(screen);
};
const screenIsOpen = () => {
    for (let el of UIElements) {
        if (el.type.split('-')[0] == 'screen')
            return el;
    }
};
export class ToolSelector extends UIElement {
    constructor() {
        super(...arguments);
        this.interactable = true;
    }
    act() {
        nextTool();
    }
    clear() {
        let ctx = layers[this.layer].ctx;
        ctx.clearRect(this.x, this.y - 20, this.width, this.height + 20);
    }
    draw() {
        let ctx = layers[this.layer].ctx;
        ctx.drawImage(this.img, this.left, this.top, this.width, this.height);
        ctx.drawImage(sprites[tool].img, this.left + 16, this.top + 16, 32, 32);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(this.left, this.top - 20, this.width, 20);
        ctx.font = '16px monospace';
        ctx.fillStyle = 'white';
        let txtStr = tools[tool].uses.toString() == 'Infinity' ? '∞' : tools[tool].uses.toString();
        let textBB = ctx.measureText(txtStr);
        ctx.fillText(txtStr, this.left + this.width / 2 - textBB.width / 2, this.top - 4);
    }
}
export class Bank extends UIElement {
    constructor() {
        super(...arguments);
        this.interactable = true;
    }
    act() {
        if (!screenIsOpen())
            openScreen(new BankScreen);
    }
}
export class InventoryButton extends UIElement {
    constructor() {
        super(...arguments);
        this.interactable = true;
    }
    act() {
        if (!screenIsOpen())
            openScreen(new InventoryScreen);
    }
}
export class XPBall extends UIElement {
    constructor() {
        super(...arguments);
        this.interactable = true;
    }
    act() {
        if (!screenIsOpen())
            openScreen(new RewardScreen);
    }
    draw() {
        let ctx = layers[this.layer].ctx;
        ctx.drawImage(this.img, this.left, this.top, this.width, this.height);
        let level = xpToCurrentLevel(xp);
        ctx.font = '26px monospace';
        let textOffsetTop = this.top + this.height - 26 * 0.75;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillText(level.toString(), this.left + 28, textOffsetTop + 2);
        ctx.fillStyle = 'white';
        ctx.fillText(level.toString(), this.left + 26, textOffsetTop);
        let levelBound = xpBoundaryForLevel(level);
        let nextLevelBound = xpBoundaryForLevel(level + 1);
        let progress = (xp - levelBound) / (nextLevelBound - levelBound);
        this.sprite.animationState = Math.floor(progress * 26);
    }
}
export class CoinDisplay extends UIElement {
    draw() {
        let ctx = layers[this.layer].ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(this.left, this.top, this.width, this.height);
        let fontSize = 16;
        ctx.font = `${fontSize}px monospace`;
        ctx.fillStyle = 'white';
        ctx.fillText(coins.toString().padStart(10, '0'), this.left + this.img.width + 4, this.top + fontSize * 0.9);
        ctx.drawImage(this.img, this.left, this.top, this.img.width, this.img.height);
    }
}
export class XPDisplay extends UIElement {
    draw() {
        let ctx = layers[this.layer].ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(this.left, this.top, this.width, this.height);
        let fontSize = 16;
        ctx.font = `${fontSize}px monospace`;
        ctx.fillStyle = 'white';
        //@ts-ignore
        ctx.fillText(xp.toString().padStart(10, '0'), this.left + this.img.width + 4, this.top + fontSize * 0.9);
        ctx.drawImage(this.img, this.left + 2, this.top, this.img.width, this.img.height);
    }
}
export class PlayButton extends UIElement {
    constructor() {
        super(...arguments);
        this.interactable = true;
    }
    act() {
        startGame();
    }
}
export class MenuButton extends UIElement {
    constructor() {
        super(...arguments);
        this.interactable = true;
    }
    act() {
        openScreen(new MenuScreen);
    }
}
export class ClearButton extends UIElement {
    constructor(opts) {
        super(opts);
        this.interactable = true;
        this.z = zIdxs.screenChild;
        if (localStorage.getItem('save') == null) {
            this.sprite = sprites.clearButtonInactive;
            this.interactable = false;
        }
    }
    act() {
        localStorage.clear();
        this.sprite = sprites.clearButtonInactive;
        this.interactable = false;
    }
}
class CloseButton extends UIElement {
    constructor(opts, target) {
        super(opts);
        this.interactable = true;
        this.z = zIdxs.screenChild;
        this.target = target;
    }
    act() {
        this.target.removeNextDraw = true;
    }
}
class Screen extends UIElement {
    constructor() {
        super({
            height: layers[0].cnv.height * 0.8,
            width: layers[0].cnv.width * 0.9,
            left: layers[0].cnv.width * 0.05,
            top: layers[0].cnv.height * 0.1,
            sprite: null,
            type: 'screen'
        });
        this.interactable = false;
        this.children = [];
        this.items = [];
        this.borderw = 4;
        this.z = zIdxs.screen;
        this.color1 = 'lightblue';
        this.color2 = 'orange';
        this.title = 'Unnamed Screen';
        let closeButton = new CloseButton({
            sprite: sprites.close,
            width: 32,
            height: 32,
            type: 'button-close',
            right: layers[this.layer].cnv.width * 0.05 - 8,
            top: this.top - 8,
        }, this);
        UIElements.push(closeButton);
        this.children.push(closeButton);
        this.populate();
    }
    populate() {
        console.error('Populate function not implemented!');
    }
    updatePosition() {
        this.width = layers[this.layer].cnv.width * 0.9;
        this.left = layers[this.layer].cnv.width * 0.05;
        this.height = layers[this.layer].cnv.height * 0.8;
        this.top = layers[this.layer].cnv.height * 0.1;
    }
    destroy() {
        super.destroy();
        for (let c of this.children) {
            c.destroy();
        }
        clearLayer('ui');
    }
    drawBG() {
        let ctx = layers[this.layer].ctx;
        ctx.fillStyle = this.color1;
        ctx.fillRect(this.x, this.top, this.width, this.height);
        // top border
        ctx.fillStyle = this.color2;
        ctx.fillRect(this.x, this.top, this.width, this.borderw);
        ctx.fillRect(this.x, this.top + 2 * this.borderw, this.width, this.borderw);
        // bottom
        ctx.fillRect(this.x, this.top + this.height - this.borderw, this.width, this.borderw);
        ctx.fillRect(this.x, this.top + this.height - 3 * this.borderw, this.width, this.borderw);
        // left
        ctx.fillRect(this.x, this.top, this.borderw, this.height);
        ctx.fillRect(this.x + this.borderw * 2, this.top, this.borderw, this.height);
        // right
        ctx.fillRect(this.x + this.width - this.borderw, this.top, this.borderw, this.height);
        ctx.fillRect(this.x + this.width - 3 * this.borderw, this.top, this.borderw, this.height);
    }
    drawTitle() {
        let ctx = layers[this.layer].ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        let fontSize = 26;
        ctx.font = fontSize + 'px monospace';
        ctx.fillText(this.title, this.left + this.borderw * 3 + 2, 2 + this.top + fontSize * .75 + this.borderw * 3);
        ctx.fillStyle = 'white';
        ctx.fillText(this.title, this.left + this.borderw * 3, this.top + fontSize * .75 + this.borderw * 3);
    }
    draw() {
        this.drawBG();
        this.drawTitle();
    }
}
export class InventoryScreen extends Screen {
    constructor() {
        super(...arguments);
        this.title = 'Inventory';
        this.color1 = '#baff7d';
        this.color2 = '#ff7dba';
    }
    populate() {
        for (let i in inventory.contents) {
            let item = { type: i, count: inventory.contents[i] };
            this.items.push(item);
        }
        let margin = 10;
        let itemSize = 32;
        let n = 0;
        let topPad = 48;
        let leftPad = 16;
        for (let i of this.items) {
            let maxCols = Math.floor(1 / ((itemSize + margin) / (this.width - margin * 2 - leftPad * 2)));
            let c = (n % maxCols);
            let r = Math.floor(n / maxCols);
            let x = this.left + c * (itemSize + margin) + margin + leftPad;
            let y = this.top + r * (itemSize + margin) + margin + topPad;
            n++;
            let newItem = new InventoryItem({
                left: x,
                top: y,
                type: i.type,
                sprite: sprites[i.type],
                height: 32,
                width: 32,
            }, this);
            this.children.push(newItem);
            UIElements.push(newItem);
        }
    }
}
class InventoryItem extends UIElement {
    constructor(opts, parentScreen) {
        super(opts);
        this.interactable = true;
        this.z = zIdxs.screenChild;
        this.parentScreen = parentScreen;
    }
    act() {
        // add move listeners etc.
        // create item
        let item = new Item({
            gridPosition: { gridX: -1, gridY: -1 },
            sprite: sprites[this.type],
            type: this.type.split('-')[0],
            level: Number(this.type.split('-')[1]),
        });
        extraActors.push(item);
        pickup(item, (placed) => {
            if (placed)
                inventory.removeByTypeAndLevel(this.type.split('-')[0], this.type.split('-')[1]);
            extraActors.splice(extraActors.indexOf(item, 1));
        });
        // add move listener
        // follow touch with item
        // close inventory
        this.parentScreen.removeNextDraw = true;
    }
    clear() {
        return;
    }
    draw() {
        let ctx = layers[this.layer].ctx;
        let x = this.left;
        let y = this.top;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(x, y, this.width, this.height);
        try {
            ctx.drawImage(sprites[this.type].cnv, x, y);
        }
        catch (e) {
            console.error('sprite_not_found: ' + this.type, e);
        }
        ctx.font = '14px monospace';
        ctx.fillStyle = 'white';
        ctx.fillText(inventory.contents[this.type].toString(), x, y + this.height);
    }
}
class BankScreen extends Screen {
    constructor() {
        super(...arguments);
        this.title = 'Bank';
        this.color1 = 'orange';
        this.color2 = 'green';
        this.type = 'screen-bank';
    }
}
class MenuScreen extends Screen {
    constructor() {
        super(...arguments);
        this.title = 'Menu';
        this.color1 = '#68aed4';
        this.color2 = '#234975';
        this.type = 'screen-menu';
    }
    populate() {
        let clearBtn = new ClearButton({
            height: 60,
            sprite: sprites.clearButton,
            type: 'clear',
            width: 92,
            top: this.top + 50,
            centerX: true
        });
        this.children.push(clearBtn);
        UIElements.push(clearBtn);
    }
}
class RewardScreen extends Screen {
    constructor() {
        super(...arguments);
        this.title = 'Rewards';
        this.color1 = 'lightblue';
        this.color2 = 'orange';
        this.type = 'screen-rewards';
    }
}
export class LevelUpScreen extends Screen {
    constructor() {
        super(...arguments);
        this.title = 'Level Up!';
        this.color1 = '#ffc800';
        this.color2 = '#9500ff';
        this.type = 'screen-levelup';
    }
    populate() {
        let lvl = xpToCurrentLevel(xp);
        this.rewards = levelManifest[lvl]?.rewards || {};
        this.rewards.coin = lvl * lvl * 10;
        if (lvl % 3 == 0)
            this.rewards.antifog = lvl * 5;
        let n = 0;
        let itemSize = 32;
        let margin = 10;
        let leftPad = 100;
        let topPad = 100;
        for (let r in this.rewards) {
            console.log('adding ', r);
            //TODO different maths to center all items
            let maxCols = Math.floor(1 / ((itemSize + margin) / (this.width - margin * 2 - leftPad * 2)));
            let col = (n % maxCols);
            let row = Math.floor(n / maxCols);
            let x = this.left + col * (itemSize + margin) + margin + leftPad;
            let y = this.top + row * (itemSize + margin) + margin + topPad;
            n++;
            let newItem = new RewardItem({
                left: x,
                top: y,
                type: r,
                count: this.rewards[r],
                sprite: sprites[r],
                height: 32,
                width: 32,
            }, this);
            UIElements.push(newItem);
            this.children.push(newItem);
        }
    }
}
class RewardItem extends UIElement {
    constructor(opts, parentScreen) {
        super(opts);
        this.z = zIdxs.screenChild;
        this.parentScreen = parentScreen;
    }
    destroy() {
        super.destroy();
        for (let i = 0; i < this.count; i++) {
            let newDrop;
            let dropLeft = (this.left + camera.x) * 1 / camera.scale;
            let dropTop = (this.top + camera.y) * 1 / camera.scale;
            switch (this.type) {
                case 'coin':
                    newDrop = new Coin({
                        height: 8,
                        sprite: sprites[this.type],
                        targetPos: [camera.right, 0],
                        type: this.type,
                        value: 1,
                        width: 8,
                        left: dropLeft,
                        top: dropTop
                    });
                    break;
                case 'antifog':
                    newDrop = new ItemDrop({
                        height: 8,
                        sprite: sprites[this.type],
                        targetPos: [0, camera.bottom],
                        type: this.type.split('-')[0],
                        level: this.type.split('-')[1],
                        value: 1,
                        width: 8,
                        left: dropLeft,
                        top: dropTop,
                        finish: () => tools.antifog.addUses(1)
                    });
                    break;
                default:
                    newDrop = new ItemDrop({
                        height: 8,
                        sprite: sprites[this.type],
                        targetPos: [camera.x + camera.viewWidth / 2, 0],
                        type: this.type.split('-')[0],
                        level: this.type.split('-')[1],
                        value: 1,
                        width: 8,
                        left: dropLeft,
                        top: dropTop,
                        finish: () => inventory.addByTypeAndLevel(this.type.split('-')[0], this.type.split('-')[1])
                    });
                    break;
            }
            extraActors.push(newDrop);
        }
    }
    draw() {
        let ctx = layers[this.layer].ctx;
        let x = this.left;
        let y = this.top;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(x, y, this.width, this.height);
        ctx.drawImage(sprites[this.type].cnv, x, y);
        let fontSize = 14;
        ctx.font = fontSize + 'px monospace';
        ctx.fillStyle = 'white';
        ctx.fillText(this.count.toString(), x, y + this.height);
    }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QztRQUM1QyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUU1QyxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbEIsR0FBRyxDQUFDLElBQUksR0FBRyxRQUFRLEdBQUcsY0FBYyxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO1FBRXhCLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1RCxDQUFDO0NBQ0oiLCJmaWxlIjoiY2xhc3MvVUlFbGVtZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHhwVG9DdXJyZW50TGV2ZWwsIHhwLCBjb2lucywgc3RhcnRHYW1lLCBpbnZlbnRvcnksIFVJRWxlbWVudHMsIHNwcml0ZXMsIHBpY2t1cCwgdGlsZUdyaWQsIGV4dHJhQWN0b3JzLCBsZXZlbE1hbmlmZXN0LCB4cEJvdW5kYXJ5Rm9yTGV2ZWwsIHRvb2wsIHRvb2xzLCBuZXh0VG9vbCwgbGF5ZXJzLCBMQVlFUk5VTUJFUlMsIGNsZWFyTGF5ZXIsIGNhbWVyYSB9IGZyb20gXCIuLi9tYWluLmpzXCI7XG5pbXBvcnQgeyBTcHJpdGUgfSBmcm9tIFwiLi9TcHJpdGUuanNcIjtcbmltcG9ydCB7IEl0ZW0gfSBmcm9tIFwiLi9JdGVtLmpzXCI7XG5pbXBvcnQgeyBDb2luLCBJdGVtRHJvcCB9IGZyb20gXCIuL0Ryb3AuanNcIjtcblxuY29uc3QgeklkeHMgPSB7XG4gICAgc2NyZWVuOiAxMCxcbiAgICBzY3JlZW5DaGlsZDogMjBcbn1cblxuZXhwb3J0IGNsYXNzIFVJRWxlbWVudCB7XG4gICAgbGVmdCA9IDA7XG4gICAgcmlnaHQ6IG51bWJlcjtcbiAgICB0b3AgPSAwO1xuICAgIGJvdHRvbTogbnVtYmVyO1xuICAgIHdpZHRoID0gMDtcbiAgICBoZWlnaHQgPSAwO1xuICAgIGxheWVyID0gTEFZRVJOVU1CRVJTLnVpO1xuICAgIHo6IG51bWJlciA9IDA7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIGludGVyYWN0YWJsZTogYm9vbGVhbjtcbiAgICBzcHJpdGU6IFNwcml0ZTtcbiAgICBjZW50ZXJYOiBib29sZWFuO1xuICAgIGNlbnRlclk6IGJvb2xlYW47XG5cbiAgICByZW1vdmVOZXh0RHJhdyA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3Iob3B0czogSVVJT3B0aW9ucykge1xuICAgICAgICBmb3IgKGxldCBvIGluIG9wdHMpIHtcbiAgICAgICAgICAgIHRoaXNbb10gPSBvcHRzW29dO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlUG9zaXRpb24oKTtcbiAgICB9XG5cbiAgICB1cGRhdGVQb3NpdGlvbigpIHtcblxuICAgICAgICBpZiAodGhpcy5jZW50ZXJYKSB7XG4gICAgICAgICAgICB0aGlzLmxlZnQgPSBsYXllcnNbdGhpcy5sYXllcl0uY252LndpZHRoIC8gMiAtIHRoaXMud2lkdGggLyAyO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmlnaHQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmxlZnQgPSBsYXllcnNbdGhpcy5sYXllcl0uY252LndpZHRoIC0gdGhpcy5yaWdodCAtIHRoaXMud2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jZW50ZXJZKSB7XG4gICAgICAgICAgICB0aGlzLnRvcCA9IGxheWVyc1t0aGlzLmxheWVyXS5jbnYuaGVpZ2h0IC8gMiAtIHRoaXMuaGVpZ2h0IC8gMjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJvdHRvbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMudG9wID0gbGF5ZXJzW3RoaXMubGF5ZXJdLmNudi5oZWlnaHQgLSB0aGlzLmJvdHRvbSAtIHRoaXMuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWN0KCkge1xuICAgICAgICBpZiAoIXRoaXMuaW50ZXJhY3RhYmxlKSByZXR1cm47XG4gICAgICAgIGNvbnNvbGUubG9nKCdBY3Rpb24gbm90IGltcGxlbWVudGVkIScsIHRoaXMpO1xuICAgIH1cblxuICAgIGRyYXcoKSB7XG4gICAgICAgIGxldCBjdHggPSBsYXllcnNbdGhpcy5sYXllcl0uY3R4O1xuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCB0aGlzLmxlZnQsIHRoaXMudG9wLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIGxldCBjdHggPSBsYXllcnNbdGhpcy5sYXllcl0uY3R4O1xuICAgICAgICBjdHguY2xlYXJSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgVUlFbGVtZW50cy5zcGxpY2UoVUlFbGVtZW50cy5pbmRleE9mKHRoaXMpLCAxKTtcbiAgICB9XG5cbiAgICBnZXQgY3R4KCk6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHtcbiAgICAgICAgcmV0dXJuIGxheWVyc1t0aGlzLmxheWVyXS5jdHg7XG4gICAgfVxuXG4gICAgZ2V0IGNudigpOkhUTUxDYW52YXNFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIGxheWVyc1t0aGlzLmxheWVyXS5jbnY7XG4gICAgfVxuXG4gICAgZ2V0IGltZygpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNwcml0ZS5jbnY7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3Nwcml0ZV9ub3RfZm91bmQgOiAnICsgdGhpcy50eXBlLCBlKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxlZnQ7XG4gICAgfVxuXG4gICAgZ2V0IHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvcDtcbiAgICB9XG5cbiAgICBjb2xsaWRlUG9pbnQoeCwgeSkge1xuICAgICAgICByZXR1cm4gKHggPiB0aGlzLnggJiYgeSA+IHRoaXMueSAmJiB4IDwgdGhpcy54ICsgdGhpcy53aWR0aCAmJiB5IDwgdGhpcy55ICsgdGhpcy5oZWlnaHQpO1xuXG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElVSU9wdGlvbnMge1xuICAgIGxlZnQ/OiBudW1iZXI7XG4gICAgcmlnaHQ/OiBudW1iZXI7XG4gICAgdG9wPzogbnVtYmVyO1xuICAgIGJvdHRvbT86IG51bWJlcjtcbiAgICBjZW50ZXJYPzogYm9vbGVhbjtcbiAgICBjZW50ZXJZPzogYm9vbGVhbjtcbiAgICB3aWR0aDogbnVtYmVyO1xuICAgIGhlaWdodDogbnVtYmVyO1xuICAgIHR5cGU6IHN0cmluZztcbiAgICBzcHJpdGU6IFNwcml0ZTtcbn1cblxuY29uc3Qgb3BlblNjcmVlbiA9IChzY3JlZW46IFNjcmVlbikgPT4ge1xuICAgIGxldCBlbCA9IHNjcmVlbklzT3BlbigpO1xuICAgIGlmIChlbCkgZWwucmVtb3ZlTmV4dERyYXcgPSB0cnVlO1xuICAgIFVJRWxlbWVudHMucHVzaChzY3JlZW4pO1xufVxuXG5jb25zdCBzY3JlZW5Jc09wZW4gPSAoKSA9PiB7XG4gICAgZm9yIChsZXQgZWwgb2YgVUlFbGVtZW50cykge1xuICAgICAgICBpZiAoZWwudHlwZS5zcGxpdCgnLScpWzBdID09ICdzY3JlZW4nKSByZXR1cm4gZWw7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVG9vbFNlbGVjdG9yIGV4dGVuZHMgVUlFbGVtZW50IHtcbiAgICBpbnRlcmFjdGFibGUgPSB0cnVlO1xuXG4gICAgYWN0KCkge1xuICAgICAgICBuZXh0VG9vbCgpO1xuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICBsZXQgY3R4ID0gbGF5ZXJzW3RoaXMubGF5ZXJdLmN0eDtcbiAgICAgICAgY3R4LmNsZWFyUmVjdCh0aGlzLngsIHRoaXMueS0yMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQrMjApO1xuICAgIH1cblxuICAgIGRyYXcoKSB7XG4gICAgICAgIGxldCBjdHggPSBsYXllcnNbdGhpcy5sYXllcl0uY3R4O1xuXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHRoaXMubGVmdCwgdGhpcy50b3AsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShzcHJpdGVzW3Rvb2xdLmltZywgdGhpcy5sZWZ0ICsgMTYsIHRoaXMudG9wICsgMTYsIDMyLCAzMik7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgwLDAsMCwwLjUpJztcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMubGVmdCwgdGhpcy50b3AgLSAyMCwgdGhpcy53aWR0aCwgMjApO1xuICAgICAgICBjdHguZm9udCA9ICcxNnB4IG1vbm9zcGFjZSc7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuICAgICAgICBsZXQgdHh0U3RyID0gdG9vbHNbdG9vbF0udXNlcy50b1N0cmluZygpID09ICdJbmZpbml0eScgPyAn4oieJyA6IHRvb2xzW3Rvb2xdLnVzZXMudG9TdHJpbmcoKTtcbiAgICAgICAgbGV0IHRleHRCQiA9IGN0eC5tZWFzdXJlVGV4dCh0eHRTdHIpO1xuICAgICAgICBjdHguZmlsbFRleHQodHh0U3RyLCB0aGlzLmxlZnQgKyB0aGlzLndpZHRoIC8gMiAtIHRleHRCQi53aWR0aCAvIDIsIHRoaXMudG9wIC0gNCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQmFuayBleHRlbmRzIFVJRWxlbWVudCB7XG4gICAgaW50ZXJhY3RhYmxlID0gdHJ1ZTtcblxuICAgIGFjdCgpIHtcbiAgICAgICAgaWYgKCFzY3JlZW5Jc09wZW4oKSkgb3BlblNjcmVlbihuZXcgQmFua1NjcmVlbik7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW52ZW50b3J5QnV0dG9uIGV4dGVuZHMgVUlFbGVtZW50IHtcbiAgICBpbnRlcmFjdGFibGUgPSB0cnVlO1xuXG4gICAgYWN0KCkge1xuICAgICAgICBpZiAoIXNjcmVlbklzT3BlbigpKSBvcGVuU2NyZWVuKG5ldyBJbnZlbnRvcnlTY3JlZW4pXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgWFBCYWxsIGV4dGVuZHMgVUlFbGVtZW50IHtcbiAgICBpbnRlcmFjdGFibGUgPSB0cnVlO1xuXG4gICAgYWN0KCkge1xuICAgICAgICBpZiAoIXNjcmVlbklzT3BlbigpKSBvcGVuU2NyZWVuKG5ldyBSZXdhcmRTY3JlZW4pO1xuICAgIH1cblxuICAgIGRyYXcoKSB7XG4gICAgICAgIGxldCBjdHggPSBsYXllcnNbdGhpcy5sYXllcl0uY3R4O1xuXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHRoaXMubGVmdCwgdGhpcy50b3AsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICBsZXQgbGV2ZWwgPSB4cFRvQ3VycmVudExldmVsKHhwKTtcblxuICAgICAgICBjdHguZm9udCA9ICcyNnB4IG1vbm9zcGFjZSc7XG5cblxuICAgICAgICBsZXQgdGV4dE9mZnNldFRvcCA9IHRoaXMudG9wICsgdGhpcy5oZWlnaHQgLSAyNiAqIDAuNzU7XG5cbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDAsMCwwLDAuNSknO1xuICAgICAgICBjdHguZmlsbFRleHQobGV2ZWwudG9TdHJpbmcoKSwgdGhpcy5sZWZ0ICsgMjgsIHRleHRPZmZzZXRUb3AgKyAyKTtcblxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcbiAgICAgICAgY3R4LmZpbGxUZXh0KGxldmVsLnRvU3RyaW5nKCksIHRoaXMubGVmdCArIDI2LCB0ZXh0T2Zmc2V0VG9wKTtcblxuICAgICAgICBsZXQgbGV2ZWxCb3VuZCA9IHhwQm91bmRhcnlGb3JMZXZlbChsZXZlbCk7XG4gICAgICAgIGxldCBuZXh0TGV2ZWxCb3VuZCA9IHhwQm91bmRhcnlGb3JMZXZlbChsZXZlbCArIDEpO1xuXG4gICAgICAgIGxldCBwcm9ncmVzcyA9ICh4cCAtIGxldmVsQm91bmQpIC8gKG5leHRMZXZlbEJvdW5kIC0gbGV2ZWxCb3VuZCk7XG5cbiAgICAgICAgdGhpcy5zcHJpdGUuYW5pbWF0aW9uU3RhdGUgPSBNYXRoLmZsb29yKHByb2dyZXNzICogMjYpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvaW5EaXNwbGF5IGV4dGVuZHMgVUlFbGVtZW50IHtcbiAgICBkcmF3KCkge1xuICAgICAgICBsZXQgY3R4ID0gbGF5ZXJzW3RoaXMubGF5ZXJdLmN0eDtcblxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsMC41KSc7XG4gICAgICAgIGN0eC5maWxsUmVjdCh0aGlzLmxlZnQsIHRoaXMudG9wLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgbGV0IGZvbnRTaXplID0gMTY7XG4gICAgICAgIGN0eC5mb250ID0gYCR7Zm9udFNpemV9cHggbW9ub3NwYWNlYDtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG4gICAgICAgIGN0eC5maWxsVGV4dChjb2lucy50b1N0cmluZygpLnBhZFN0YXJ0KDEwLCAnMCcpLCB0aGlzLmxlZnQgKyB0aGlzLmltZy53aWR0aCArIDQsIHRoaXMudG9wICsgZm9udFNpemUgKiAwLjkpO1xuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCB0aGlzLmxlZnQsIHRoaXMudG9wLCB0aGlzLmltZy53aWR0aCwgdGhpcy5pbWcuaGVpZ2h0KTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBYUERpc3BsYXkgZXh0ZW5kcyBVSUVsZW1lbnQge1xuICAgIGRyYXcoKSB7XG4gICAgICAgIGxldCBjdHggPSBsYXllcnNbdGhpcy5sYXllcl0uY3R4O1xuXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgwLDAsMCwwLjUpJztcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMubGVmdCwgdGhpcy50b3AsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICBsZXQgZm9udFNpemUgPSAxNjtcbiAgICAgICAgY3R4LmZvbnQgPSBgJHtmb250U2l6ZX1weCBtb25vc3BhY2VgO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcblxuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgY3R4LmZpbGxUZXh0KHhwLnRvU3RyaW5nKCkucGFkU3RhcnQoMTAsICcwJyksIHRoaXMubGVmdCArIHRoaXMuaW1nLndpZHRoICsgNCwgdGhpcy50b3AgKyBmb250U2l6ZSAqIDAuOSk7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHRoaXMubGVmdCArIDIsIHRoaXMudG9wLCB0aGlzLmltZy53aWR0aCwgdGhpcy5pbWcuaGVpZ2h0KTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQbGF5QnV0dG9uIGV4dGVuZHMgVUlFbGVtZW50IHtcbiAgICBpbnRlcmFjdGFibGUgPSB0cnVlO1xuICAgIGFjdCgpIHtcbiAgICAgICAgc3RhcnRHYW1lKCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTWVudUJ1dHRvbiBleHRlbmRzIFVJRWxlbWVudCB7XG4gICAgaW50ZXJhY3RhYmxlID0gdHJ1ZTtcbiAgICBhY3QoKSB7XG4gICAgICAgIG9wZW5TY3JlZW4obmV3IE1lbnVTY3JlZW4pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENsZWFyQnV0dG9uIGV4dGVuZHMgVUlFbGVtZW50IHtcbiAgICBpbnRlcmFjdGFibGUgPSB0cnVlO1xuICAgIHogPSB6SWR4cy5zY3JlZW5DaGlsZDtcblxuICAgIGNvbnN0cnVjdG9yKG9wdHM6IElVSU9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG5cbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzYXZlJykgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5zcHJpdGUgPSBzcHJpdGVzLmNsZWFyQnV0dG9uSW5hY3RpdmU7XG4gICAgICAgICAgICB0aGlzLmludGVyYWN0YWJsZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFjdCgpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gc3ByaXRlcy5jbGVhckJ1dHRvbkluYWN0aXZlO1xuICAgICAgICB0aGlzLmludGVyYWN0YWJsZSA9IGZhbHNlO1xuICAgIH1cbn1cblxuY2xhc3MgQ2xvc2VCdXR0b24gZXh0ZW5kcyBVSUVsZW1lbnQge1xuICAgIGludGVyYWN0YWJsZSA9IHRydWU7XG4gICAgdGFyZ2V0O1xuICAgIHogPSB6SWR4cy5zY3JlZW5DaGlsZDtcbiAgICBjb25zdHJ1Y3RvcihvcHRzOiBJVUlPcHRpb25zLCB0YXJnZXQpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIH1cblxuICAgIGFjdCgpIHtcbiAgICAgICAgdGhpcy50YXJnZXQucmVtb3ZlTmV4dERyYXcgPSB0cnVlO1xuICAgIH1cbn1cblxuY2xhc3MgU2NyZWVuIGV4dGVuZHMgVUlFbGVtZW50IHtcbiAgICBpbnRlcmFjdGFibGUgPSBmYWxzZTtcbiAgICBjaGlsZHJlbiA9IFtdO1xuICAgIGl0ZW1zID0gW107XG4gICAgYm9yZGVydyA9IDQ7XG5cbiAgICB6ID0geklkeHMuc2NyZWVuO1xuXG4gICAgY29sb3IxID0gJ2xpZ2h0Ymx1ZSc7XG4gICAgY29sb3IyID0gJ29yYW5nZSc7XG5cbiAgICB0aXRsZSA9ICdVbm5hbWVkIFNjcmVlbic7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgaGVpZ2h0OiBsYXllcnNbMF0uY252LmhlaWdodCAqIDAuOCxcbiAgICAgICAgICAgIHdpZHRoOiBsYXllcnNbMF0uY252LndpZHRoICogMC45LFxuICAgICAgICAgICAgbGVmdDogbGF5ZXJzWzBdLmNudi53aWR0aCAqIDAuMDUsXG4gICAgICAgICAgICB0b3A6IGxheWVyc1swXS5jbnYuaGVpZ2h0ICogMC4xLFxuICAgICAgICAgICAgc3ByaXRlOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogJ3NjcmVlbidcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGNsb3NlQnV0dG9uID0gbmV3IENsb3NlQnV0dG9uKHtcbiAgICAgICAgICAgIHNwcml0ZTogc3ByaXRlcy5jbG9zZSxcbiAgICAgICAgICAgIHdpZHRoOiAzMixcbiAgICAgICAgICAgIGhlaWdodDogMzIsXG4gICAgICAgICAgICB0eXBlOiAnYnV0dG9uLWNsb3NlJyxcbiAgICAgICAgICAgIHJpZ2h0OiBsYXllcnNbdGhpcy5sYXllcl0uY252LndpZHRoICogMC4wNSAtIDgsXG4gICAgICAgICAgICB0b3A6IHRoaXMudG9wIC0gOCxcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIFVJRWxlbWVudHMucHVzaChjbG9zZUJ1dHRvbik7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjbG9zZUJ1dHRvbik7XG5cbiAgICAgICAgdGhpcy5wb3B1bGF0ZSgpO1xuICAgIH1cblxuICAgIHBvcHVsYXRlKCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdQb3B1bGF0ZSBmdW5jdGlvbiBub3QgaW1wbGVtZW50ZWQhJyk7XG4gICAgfVxuXG4gICAgdXBkYXRlUG9zaXRpb24oKSB7XG4gICAgICAgIHRoaXMud2lkdGggPSBsYXllcnNbdGhpcy5sYXllcl0uY252LndpZHRoICogMC45O1xuICAgICAgICB0aGlzLmxlZnQgPSBsYXllcnNbdGhpcy5sYXllcl0uY252LndpZHRoICogMC4wNTtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBsYXllcnNbdGhpcy5sYXllcl0uY252LmhlaWdodCAqIDAuODtcbiAgICAgICAgdGhpcy50b3AgPSBsYXllcnNbdGhpcy5sYXllcl0uY252LmhlaWdodCAqIDAuMTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICAgIGZvciAobGV0IGMgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgICAgICAgYy5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgY2xlYXJMYXllcigndWknKTtcbiAgICB9XG5cbiAgICBkcmF3QkcoKSB7XG4gICAgICAgIGxldCBjdHggPSBsYXllcnNbdGhpcy5sYXllcl0uY3R4O1xuXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yMTtcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMueCwgdGhpcy50b3AsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICAvLyB0b3AgYm9yZGVyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yMjtcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMueCwgdGhpcy50b3AsIHRoaXMud2lkdGgsIHRoaXMuYm9yZGVydyk7XG4gICAgICAgIGN0eC5maWxsUmVjdCh0aGlzLngsIHRoaXMudG9wICsgMiAqIHRoaXMuYm9yZGVydywgdGhpcy53aWR0aCwgdGhpcy5ib3JkZXJ3KTtcblxuICAgICAgICAvLyBib3R0b21cbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMueCwgdGhpcy50b3AgKyB0aGlzLmhlaWdodCAtIHRoaXMuYm9yZGVydywgdGhpcy53aWR0aCwgdGhpcy5ib3JkZXJ3KTtcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMueCwgdGhpcy50b3AgKyB0aGlzLmhlaWdodCAtIDMgKiB0aGlzLmJvcmRlcncsIHRoaXMud2lkdGgsIHRoaXMuYm9yZGVydyk7XG5cbiAgICAgICAgLy8gbGVmdFxuICAgICAgICBjdHguZmlsbFJlY3QodGhpcy54LCB0aGlzLnRvcCwgdGhpcy5ib3JkZXJ3LCB0aGlzLmhlaWdodCk7XG4gICAgICAgIGN0eC5maWxsUmVjdCh0aGlzLnggKyB0aGlzLmJvcmRlcncgKiAyLCB0aGlzLnRvcCwgdGhpcy5ib3JkZXJ3LCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgLy8gcmlnaHRcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMueCArIHRoaXMud2lkdGggLSB0aGlzLmJvcmRlcncsIHRoaXMudG9wLCB0aGlzLmJvcmRlcncsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMueCArIHRoaXMud2lkdGggLSAzICogdGhpcy5ib3JkZXJ3LCB0aGlzLnRvcCwgdGhpcy5ib3JkZXJ3LCB0aGlzLmhlaWdodCk7XG4gICAgfVxuXG4gICAgZHJhd1RpdGxlKCkge1xuICAgICAgICBsZXQgY3R4ID0gbGF5ZXJzW3RoaXMubGF5ZXJdLmN0eDtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDAsMCwwLDAuNSknO1xuICAgICAgICBsZXQgZm9udFNpemUgPSAyNjtcbiAgICAgICAgY3R4LmZvbnQgPSBmb250U2l6ZSArICdweCBtb25vc3BhY2UnO1xuICAgICAgICBjdHguZmlsbFRleHQodGhpcy50aXRsZSwgdGhpcy5sZWZ0ICsgdGhpcy5ib3JkZXJ3ICogMyArIDIsIDIgKyB0aGlzLnRvcCArIGZvbnRTaXplICogLjc1ICsgdGhpcy5ib3JkZXJ3ICogMyk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuICAgICAgICBjdHguZmlsbFRleHQodGhpcy50aXRsZSwgdGhpcy5sZWZ0ICsgdGhpcy5ib3JkZXJ3ICogMywgdGhpcy50b3AgKyBmb250U2l6ZSAqIC43NSArIHRoaXMuYm9yZGVydyAqIDMpO1xuICAgIH1cblxuICAgIGRyYXcoKSB7XG4gICAgICAgIHRoaXMuZHJhd0JHKCk7XG4gICAgICAgIHRoaXMuZHJhd1RpdGxlKCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW52ZW50b3J5U2NyZWVuIGV4dGVuZHMgU2NyZWVuIHtcbiAgICB0aXRsZSA9ICdJbnZlbnRvcnknO1xuICAgIGNvbG9yMSA9ICcjYmFmZjdkJztcbiAgICBjb2xvcjIgPSAnI2ZmN2RiYSc7XG5cbiAgICBwb3B1bGF0ZSgpIHtcbiAgICAgICAgZm9yIChsZXQgaSBpbiBpbnZlbnRvcnkuY29udGVudHMpIHtcbiAgICAgICAgICAgIGxldCBpdGVtID0geyB0eXBlOiBpLCBjb3VudDogaW52ZW50b3J5LmNvbnRlbnRzW2ldIH07XG4gICAgICAgICAgICB0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWFyZ2luID0gMTA7XG4gICAgICAgIGxldCBpdGVtU2l6ZSA9IDMyO1xuICAgICAgICBsZXQgbiA9IDA7XG5cbiAgICAgICAgbGV0IHRvcFBhZCA9IDQ4O1xuICAgICAgICBsZXQgbGVmdFBhZCA9IDE2O1xuXG4gICAgICAgIGZvciAobGV0IGkgb2YgdGhpcy5pdGVtcykge1xuICAgICAgICAgICAgbGV0IG1heENvbHMgPSBNYXRoLmZsb29yKDEgLyAoKGl0ZW1TaXplICsgbWFyZ2luKSAvICh0aGlzLndpZHRoIC0gbWFyZ2luICogMiAtIGxlZnRQYWQgKiAyKSkpO1xuXG4gICAgICAgICAgICBsZXQgYyA9IChuICUgbWF4Q29scyk7XG5cbiAgICAgICAgICAgIGxldCByID0gTWF0aC5mbG9vcihuIC8gbWF4Q29scyk7XG5cbiAgICAgICAgICAgIGxldCB4ID0gdGhpcy5sZWZ0ICsgYyAqIChpdGVtU2l6ZSArIG1hcmdpbikgKyBtYXJnaW4gKyBsZWZ0UGFkO1xuICAgICAgICAgICAgbGV0IHkgPSB0aGlzLnRvcCArIHIgKiAoaXRlbVNpemUgKyBtYXJnaW4pICsgbWFyZ2luICsgdG9wUGFkO1xuXG4gICAgICAgICAgICBuKys7XG5cbiAgICAgICAgICAgIGxldCBuZXdJdGVtID0gbmV3IEludmVudG9yeUl0ZW0oe1xuICAgICAgICAgICAgICAgIGxlZnQ6IHgsXG4gICAgICAgICAgICAgICAgdG9wOiB5LFxuICAgICAgICAgICAgICAgIHR5cGU6IGkudHlwZSxcbiAgICAgICAgICAgICAgICBzcHJpdGU6IHNwcml0ZXNbaS50eXBlXSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAzMixcbiAgICAgICAgICAgIH0sIHRoaXMpXG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChuZXdJdGVtKTtcbiAgICAgICAgICAgIFVJRWxlbWVudHMucHVzaChuZXdJdGVtKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgSW52ZW50b3J5SXRlbSBleHRlbmRzIFVJRWxlbWVudCB7XG4gICAgaW50ZXJhY3RhYmxlID0gdHJ1ZTtcbiAgICBwYXJlbnRTY3JlZW46IEludmVudG9yeVNjcmVlbjtcbiAgICB6ID0geklkeHMuc2NyZWVuQ2hpbGQ7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRzOiBJVUlPcHRpb25zLCBwYXJlbnRTY3JlZW46IEludmVudG9yeVNjcmVlbikge1xuICAgICAgICBzdXBlcihvcHRzKTtcblxuICAgICAgICB0aGlzLnBhcmVudFNjcmVlbiA9IHBhcmVudFNjcmVlbjtcbiAgICB9XG5cbiAgICBhY3QoKSB7XG4gICAgICAgIC8vIGFkZCBtb3ZlIGxpc3RlbmVycyBldGMuXG5cbiAgICAgICAgLy8gY3JlYXRlIGl0ZW1cbiAgICAgICAgbGV0IGl0ZW0gPSBuZXcgSXRlbSh7XG4gICAgICAgICAgICBncmlkUG9zaXRpb246IHsgZ3JpZFg6IC0xLCBncmlkWTogLTEgfSxcbiAgICAgICAgICAgIHNwcml0ZTogc3ByaXRlc1t0aGlzLnR5cGVdLFxuICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlLnNwbGl0KCctJylbMF0sXG4gICAgICAgICAgICBsZXZlbDogTnVtYmVyKHRoaXMudHlwZS5zcGxpdCgnLScpWzFdKSxcbiAgICAgICAgfSlcblxuICAgICAgICBleHRyYUFjdG9ycy5wdXNoKGl0ZW0pO1xuXG4gICAgICAgIHBpY2t1cChpdGVtLCAocGxhY2VkOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmIChwbGFjZWQpIGludmVudG9yeS5yZW1vdmVCeVR5cGVBbmRMZXZlbCh0aGlzLnR5cGUuc3BsaXQoJy0nKVswXSwgdGhpcy50eXBlLnNwbGl0KCctJylbMV0pO1xuICAgICAgICAgICAgZXh0cmFBY3RvcnMuc3BsaWNlKGV4dHJhQWN0b3JzLmluZGV4T2YoaXRlbSwgMSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBhZGQgbW92ZSBsaXN0ZW5lclxuICAgICAgICAvLyBmb2xsb3cgdG91Y2ggd2l0aCBpdGVtXG4gICAgICAgIC8vIGNsb3NlIGludmVudG9yeVxuXG4gICAgICAgIHRoaXMucGFyZW50U2NyZWVuLnJlbW92ZU5leHREcmF3ID0gdHJ1ZTtcbiAgICB9XG5cblxuICAgIGNsZWFyKCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZHJhdygpIHtcbiAgICAgICAgbGV0IGN0eCA9IGxheWVyc1t0aGlzLmxheWVyXS5jdHg7XG5cbiAgICAgICAgbGV0IHggPSB0aGlzLmxlZnQ7XG4gICAgICAgIGxldCB5ID0gdGhpcy50b3A7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgwLDAsMCwwLjUpJztcblxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShzcHJpdGVzW3RoaXMudHlwZV0uY252LCB4LCB5KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignc3ByaXRlX25vdF9mb3VuZDogJyArIHRoaXMudHlwZSwgZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjdHguZm9udCA9ICcxNHB4IG1vbm9zcGFjZSc7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuXG4gICAgICAgIGN0eC5maWxsVGV4dChpbnZlbnRvcnkuY29udGVudHNbdGhpcy50eXBlXS50b1N0cmluZygpLCB4LCB5ICsgdGhpcy5oZWlnaHQpO1xuICAgIH1cbn1cblxuY2xhc3MgQmFua1NjcmVlbiBleHRlbmRzIFNjcmVlbiB7XG4gICAgdGl0bGUgPSAnQmFuayc7XG4gICAgY29sb3IxID0gJ29yYW5nZSc7XG4gICAgY29sb3IyID0gJ2dyZWVuJztcbiAgICB0eXBlID0gJ3NjcmVlbi1iYW5rJztcbn1cblxuY2xhc3MgTWVudVNjcmVlbiBleHRlbmRzIFNjcmVlbiB7XG4gICAgdGl0bGUgPSAnTWVudSc7XG4gICAgY29sb3IxID0gJyM2OGFlZDQnO1xuICAgIGNvbG9yMiA9ICcjMjM0OTc1JztcbiAgICB0eXBlID0gJ3NjcmVlbi1tZW51JztcblxuICAgIHBvcHVsYXRlKCkge1xuICAgICAgICBsZXQgY2xlYXJCdG4gPSBuZXcgQ2xlYXJCdXR0b24oe1xuICAgICAgICAgICAgaGVpZ2h0OiA2MCxcbiAgICAgICAgICAgIHNwcml0ZTogc3ByaXRlcy5jbGVhckJ1dHRvbixcbiAgICAgICAgICAgIHR5cGU6ICdjbGVhcicsXG4gICAgICAgICAgICB3aWR0aDogOTIsXG4gICAgICAgICAgICB0b3A6IHRoaXMudG9wICsgNTAsXG4gICAgICAgICAgICBjZW50ZXJYOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjbGVhckJ0bik7XG4gICAgICAgIFVJRWxlbWVudHMucHVzaChjbGVhckJ0bik7XG4gICAgfVxufVxuXG5jbGFzcyBSZXdhcmRTY3JlZW4gZXh0ZW5kcyBTY3JlZW4ge1xuICAgIHRpdGxlID0gJ1Jld2FyZHMnO1xuICAgIGNvbG9yMSA9ICdsaWdodGJsdWUnO1xuICAgIGNvbG9yMiA9ICdvcmFuZ2UnO1xuICAgIHR5cGUgPSAnc2NyZWVuLXJld2FyZHMnO1xufVxuXG5leHBvcnQgY2xhc3MgTGV2ZWxVcFNjcmVlbiBleHRlbmRzIFNjcmVlbiB7XG4gICAgdGl0bGUgPSAnTGV2ZWwgVXAhJztcbiAgICBjb2xvcjEgPSAnI2ZmYzgwMCc7XG4gICAgY29sb3IyID0gJyM5NTAwZmYnO1xuICAgIHR5cGUgPSAnc2NyZWVuLWxldmVsdXAnO1xuXG4gICAgcmV3YXJkcztcblxuICAgIHBvcHVsYXRlKCkge1xuICAgICAgICBsZXQgbHZsID0geHBUb0N1cnJlbnRMZXZlbCh4cCk7XG4gICAgICAgIHRoaXMucmV3YXJkcyA9IGxldmVsTWFuaWZlc3RbbHZsXT8ucmV3YXJkcyB8fCB7fTtcblxuICAgICAgICB0aGlzLnJld2FyZHMuY29pbiA9IGx2bCAqIGx2bCAqIDEwO1xuXG4gICAgICAgIGlmIChsdmwgJSAzID09IDApIHRoaXMucmV3YXJkcy5hbnRpZm9nID0gbHZsICogNTtcblxuXG4gICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgbGV0IGl0ZW1TaXplID0gMzI7XG4gICAgICAgIGxldCBtYXJnaW4gPSAxMDtcbiAgICAgICAgbGV0IGxlZnRQYWQgPSAxMDA7XG4gICAgICAgIGxldCB0b3BQYWQgPSAxMDA7XG5cbiAgICAgICAgZm9yIChsZXQgciBpbiB0aGlzLnJld2FyZHMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhZGRpbmcgJywgcilcbiAgICAgICAgICAgIC8vVE9ETyBkaWZmZXJlbnQgbWF0aHMgdG8gY2VudGVyIGFsbCBpdGVtc1xuICAgICAgICAgICAgbGV0IG1heENvbHMgPSBNYXRoLmZsb29yKDEgLyAoKGl0ZW1TaXplICsgbWFyZ2luKSAvICh0aGlzLndpZHRoIC0gbWFyZ2luICogMiAtIGxlZnRQYWQgKiAyKSkpO1xuXG4gICAgICAgICAgICBsZXQgY29sID0gKG4gJSBtYXhDb2xzKTtcblxuICAgICAgICAgICAgbGV0IHJvdyA9IE1hdGguZmxvb3IobiAvIG1heENvbHMpO1xuXG4gICAgICAgICAgICBsZXQgeCA9IHRoaXMubGVmdCArIGNvbCAqIChpdGVtU2l6ZSArIG1hcmdpbikgKyBtYXJnaW4gKyBsZWZ0UGFkO1xuICAgICAgICAgICAgbGV0IHkgPSB0aGlzLnRvcCArIHJvdyAqIChpdGVtU2l6ZSArIG1hcmdpbikgKyBtYXJnaW4gKyB0b3BQYWQ7XG5cbiAgICAgICAgICAgIG4rKztcblxuICAgICAgICAgICAgbGV0IG5ld0l0ZW0gPSBuZXcgUmV3YXJkSXRlbSh7XG4gICAgICAgICAgICAgICAgbGVmdDogeCxcbiAgICAgICAgICAgICAgICB0b3A6IHksXG4gICAgICAgICAgICAgICAgdHlwZTogcixcbiAgICAgICAgICAgICAgICBjb3VudDogdGhpcy5yZXdhcmRzW3JdLFxuICAgICAgICAgICAgICAgIHNwcml0ZTogc3ByaXRlc1tyXSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAzMixcbiAgICAgICAgICAgIH0sIHRoaXMpXG5cbiAgICAgICAgICAgIFVJRWxlbWVudHMucHVzaChuZXdJdGVtKTtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChuZXdJdGVtKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgUmV3YXJkSXRlbSBleHRlbmRzIFVJRWxlbWVudCB7XG4gICAgcGFyZW50U2NyZWVuOiBSZXdhcmRTY3JlZW47XG4gICAgY291bnQ6IG51bWJlcjtcbiAgICB6ID0geklkeHMuc2NyZWVuQ2hpbGQ7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRzOiB7IGNvdW50OiBudW1iZXIgfSAmIElVSU9wdGlvbnMsIHBhcmVudFNjcmVlbjogUmV3YXJkU2NyZWVuKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuXG4gICAgICAgIHRoaXMucGFyZW50U2NyZWVuID0gcGFyZW50U2NyZWVuO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGxldCBuZXdEcm9wO1xuICAgICAgICAgICAgbGV0IGRyb3BMZWZ0ID0gKHRoaXMubGVmdCArIGNhbWVyYS54KSoxL2NhbWVyYS5zY2FsZTtcbiAgICAgICAgICAgIGxldCBkcm9wVG9wID0gKHRoaXMudG9wICsgY2FtZXJhLnkpKjEvY2FtZXJhLnNjYWxlO1xuXG5cbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29pbic6XG4gICAgICAgICAgICAgICAgICAgIG5ld0Ryb3AgPSBuZXcgQ29pbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDgsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcHJpdGU6IHNwcml0ZXNbdGhpcy50eXBlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFBvczogW2NhbWVyYS5yaWdodCwgMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA4LFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogZHJvcExlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6IGRyb3BUb3BcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYW50aWZvZyc6XG4gICAgICAgICAgICAgICAgICAgIG5ld0Ryb3AgPSBuZXcgSXRlbURyb3Aoe1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA4LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ByaXRlOiBzcHJpdGVzW3RoaXMudHlwZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRQb3M6IFswLCBjYW1lcmEuYm90dG9tXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZS5zcGxpdCgnLScpWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV2ZWw6IHRoaXMudHlwZS5zcGxpdCgnLScpWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogOCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGRyb3BMZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBkcm9wVG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmluaXNoOiAoKSA9PiB0b29scy5hbnRpZm9nLmFkZFVzZXMoMSlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgbmV3RHJvcCA9IG5ldyBJdGVtRHJvcCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDgsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcHJpdGU6IHNwcml0ZXNbdGhpcy50eXBlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFBvczogW2NhbWVyYS54ICsgY2FtZXJhLnZpZXdXaWR0aC8yLCAwXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZS5zcGxpdCgnLScpWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV2ZWw6IHRoaXMudHlwZS5zcGxpdCgnLScpWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogOCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGRyb3BMZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBkcm9wVG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmluaXNoOiAoKSA9PiBpbnZlbnRvcnkuYWRkQnlUeXBlQW5kTGV2ZWwodGhpcy50eXBlLnNwbGl0KCctJylbMF0sIHRoaXMudHlwZS5zcGxpdCgnLScpWzFdKVxuXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBleHRyYUFjdG9ycy5wdXNoKG5ld0Ryb3ApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZHJhdygpIHtcbiAgICAgICAgbGV0IGN0eCA9IGxheWVyc1t0aGlzLmxheWVyXS5jdHg7XG4gICAgICAgIGxldCB4ID0gdGhpcy5sZWZ0O1xuICAgICAgICBsZXQgeSA9IHRoaXMudG9wO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsMC41KSc7XG5cbiAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShzcHJpdGVzW3RoaXMudHlwZV0uY252LCB4LCB5KTtcblxuICAgICAgICBsZXQgZm9udFNpemUgPSAxNDtcbiAgICAgICAgY3R4LmZvbnQgPSBmb250U2l6ZSArICdweCBtb25vc3BhY2UnO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcblxuICAgICAgICBjdHguZmlsbFRleHQodGhpcy5jb3VudC50b1N0cmluZygpLCB4LCB5ICsgdGhpcy5oZWlnaHQpO1xuICAgIH1cbn0iXX0=
