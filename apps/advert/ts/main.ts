document.addEventListener('DOMContentLoaded', () => {
    console.log('YEET');
    loaded();
})

const COSTS = {
    VERY_LOW: 0,
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    VERY_HIGH: 0
}

const AdManifest = {
    // Unlock: base cost to unlock and use
    // Base effectiveness values; actual effectiveness depends on person
    "text": {
        cost: COSTS.VERY_LOW,
        effecitveness: 1,
        unlock: 100,
        runtime: 60 * 60,
        cooldown: 60,
        target: 'person'
    },
    "video": {
        cost: COSTS.MEDIUM,
        effecitveness: 2,
        unlock: 500,
        runtime: 3 * 60 * 60,
        cooldown: 5 * 60,
        target: 'person'
    },
    "audio": {
        cost: COSTS.LOW,
        effecitveness: 1,
        unlock: 300,
        runtime: 2 * 60 * 60,
        cooldown: 3 * 60,
        target: 'radio'
    },
    "paper": {
        cost: COSTS.LOW,
        effecitveness: 0.005,// IF viewed; only boomers read papers
        unlock: 500,
        runtime: 5 * 60 * 60,
        cooldown: 7 * 60,
        target: 'newsstand16'
    },
    "billboard": {
        cost: COSTS.VERY_HIGH,
        effecitveness: 0.01,
        unlock: 1500,
        runtime: 5 * 60 * 60,
        cooldown: 10 * 60,
        target: 'billboard'
    },
    "tv": {
        cost: COSTS.VERY_HIGH,
        effecitveness: 2,
        unlock: 2500,
        runtime: 10 * 60 * 60,
        cooldown: 15 * 60,
        target: 'tv'
    },
}

const ProductManifest = {
    "coffee": {
        "cost": 5,
        "unlock": 100
    },
    "food": {
        "cost": 10,
        "unlock": 1000
    },
    "clothing": {
        "cost": 15,
        "unlock": 2500
    },
    "technology": {
        "cost": 25,
        "unlock": 5000
    },
    "gambling": {
        "cost": 50,
        "unlock": 15000
    },
    "alcohol": {
        "cost": 30,
        "unlock": 10000
    },
    "empty": {
        "cost": 0,
        "unlock": 0
    }
}

type ProductType =
    "coffee" |
    "clothing" |
    "technology" |
    "food" |
    "alcohol" |
    "gambling";

let allProducts: ProductType[] = [
    "coffee", "food", "alcohol", "technology", "gambling", "clothing"
]

type AdvertType =
    "text" |
    "video" |
    "audio" |
    "paper" |
    "billboard" |
    "tv";

async function wait(ms) {
    return new Promise(res => {
        setTimeout(res, ms);
    })
}

function getClass(o: Object) {
    return Object.getPrototypeOf(o).constructor.name;
}

function randomProduct() {
    let n = Math.floor(Math.random() * allProducts.length);

    return allProducts[n] as ProductType;
}

function ms2mins(ms) {
    let secs = Math.floor(ms / 1000);
    let mins = Math.floor(secs / 60);

    secs -= mins * 60;

    let secStr = secs.toString();
    let minStr = mins.toString();

    if (secStr.length == 1) secStr = `0${secs}`;
    if (minStr.length == 1) minStr = `0${mins}`;

    return `${minStr}:${secStr}`;
}

function frames2mins(f) {
    let secs = Math.floor(f / 60);
    let mins = Math.floor(secs / 60);

    secs -= mins * 60;

    let secStr = secs.toString();
    let minStr = mins.toString();

    if (secStr.length == 1) secStr = `0${secs}`;
    if (minStr.length == 1) minStr = `0${mins}`;

    return `${minStr}:${secStr}`;
}

class Person {
    likes: ProductType[];
    dislikes: ProductType[];
    x: number;
    y: number;
    width: number;
    height: number;
    wealth: number;

    age: 'boomer' | 'zoomer';

    moveSpeed: number;

    inside: boolean;

    motiveBalancer: MotiveBalancer;

    droppable: boolean;

    img: HTMLImageElement;

    currentPath: Path;
    atHome: boolean;

    acceptedDrops: string[];

    color: string;
    earnedThisRest: any;

    clickable: boolean;

    constructor() {
        this.likes = [];
        this.dislikes = [];
        this.wealth = 100;
        this.atHome = true;

        this.clickable = true;

        this.motiveBalancer = new MotiveBalancer;

        this.earnedThisRest = false;

        this.inside = false;

        this.moveSpeed = 1;

        this.acceptedDrops = ['video', 'text'];

        let selectedPath = Math.random() > 0.5 ? 0 : 33;

        this.x = paths[selectedPath].x;
        this.y = paths[selectedPath].y;

        this.currentPath = paths[selectedPath];

        this.width = 32;
        this.height = 32;

        this.droppable = true;

        this.img = document.createElement('img');
        this.img.src = 'img/person.png';

        this.createLikes();

        this.color = this.createColor();
    }

    get motive() {
        return <string>this.motiveBalancer.currentMotive;
    }

    get cx() {
        return this.x + this.width / 2;
    }

    get cy() {
        return this.y + this.height / 2;
    }

    get by() {
        return this.y + this.height;
    }

    createLikes() {
        for (let p of allProducts) {
            let n = Math.random();
            if (n > 2 / 3) this.likes.push(<ProductType>p);
            if (n < 1 / 3) this.dislikes.push(<ProductType>p);
        }

        if (this.likes.length == 0) {
            this.likes.push(randomProduct());
            if (this.dislikes.indexOf(this.likes[0]) !== -1) this.dislikes.splice(this.dislikes.indexOf(this.likes[0]), 1);
        }
    }

    createColor() {
        let r = 127, g = 127, b = 127;
        for (let l of this.likes) {
            switch (l) {
                case "coffee":
                    r += 42
                    break;
                case "food":
                    r += 84
                    break;
                case "clothing":
                    g += 42
                    break;
                case "technology":
                    g += 84
                    break;
                case "gambling":
                    b += 42
                    break;
                case "alcohol":
                    b += 84
                    break;
            }
        }

        for (let d of this.dislikes) {
            switch (d) {
                case "coffee":
                    r -= 42
                    break;
                case "food":
                    r -= 84
                    break;
                case "clothing":
                    g -= 42
                    break;
                case "technology":
                    g -= 84
                    break;
                case "gambling":
                    b -= 42
                    break;
                case "alcohol":
                    b -= 84
                    break;
            }
        }

        return `rgb(${r},${g},${b})`;
    }

    updateMotives() {
        if (!this.inside) {
            for (let l of this.likes) {
                this.motiveBalancer.addMotivation(l, 0.001);
            }
            for (let l of this.dislikes) {
                this.motiveBalancer.loseMotivation(l, 0.001);
            }
        }

        if (this.atHome) {
            this.motiveBalancer.loseMotivation('home', 0.1);
            this.motiveBalancer.addMotivation(radio.type,AdManifest.audio.effecitveness);
            this.motiveBalancer.addMotivation(tv.type,AdManifest.tv.effecitveness);
            this.wealth += 1;
        } else {
            this.motiveBalancer.addMotivation('home', 0.001);
        }

        if (ProductManifest[this.motive] && this.wealth < ProductManifest[this.motive].cost) {
            this.motiveBalancer.addMotivation('home', 1);
            this.motiveBalancer.loseMotivation(this.motive, 100);
            //     console.log('skint',this);
        }

        this.motiveBalancer.balance();
    }

    drop(ad: ProductSlot) {
        if (getClass(ad) == 'ProductSlot' && this.acceptedDrops.indexOf(ad.type) !== -1) {
            // console.log(ad.productType, 'seems like a good idea! thanks', ad.type, '!');

            // calculate if ad affected us
            this.motiveBalancer.addMotivation(ad.productType, 1);

            return true;
        }

        // console.log(this.acceptedDrops);
        console.log('ow dont throw', ad.type, 'at me!');
        return false;
    }

    wander() {
        if (paths.indexOf(this.currentPath) == 20) {
            this.walkTo(this.currentPath);
        } else {
            this.walkTo(this.currentPath.nextPath);
        }
    }

    walkTo(target, shop?: boolean) {
        if (this.motive == 'home' && this.atHome) return;
        this.atHome = false;
        // let t = buildings.filter(v => v.type == target)[0];
        let tX = target.x + target.width / 2;
        let tY = target.y + target.height;
        if (this.cx > tX) this.x -= this.moveSpeed;
        if (this.cx < tX) this.x += this.moveSpeed;
        if (this.by > tY) this.y -= this.moveSpeed;
        if (this.by < tY) this.y += this.moveSpeed;

        // if at shop
        if (this.cx >= tX - (1 + this.moveSpeed)
            && this.cx <= tX + (1 + this.moveSpeed)
            && this.by >= tY - (1 + this.moveSpeed)
            && this.by <= tY + (1 + this.moveSpeed)) {
            if (shop) {
                this.buy(target);
                this.inside = true;
                wait(1000 + Math.random() * 3000).then(() => this.inside = false);
                // console.log(this);
            } else {
                if (this.motive == 'home' && (paths.indexOf(this.currentPath) == 20 || paths.indexOf(this.currentPath) == 4)) {
                    this.atHome = true;
                } else {
                    // target next path block
                    this.currentPath = this.currentPath.nextPath;
                    this.earnedThisRest = false;
                }
            }
        }

        // console.log(paths.indexOf(this.currentPath));
    }

    buy(product: Building) {
        // console.log('Mmmmm,', product.type);
        if (this.wealth >= product.cost) {
            this.wealth -= product.cost;

            let currentProduct = products.filter(p => p.type == product.type)[0]
            if (currentProduct.unlocked) {
                bank.increment(product.cost);
                pickups.push(new CashPickup(this.cx, this.cy, product.cost));
            }
        } else {
            this.motiveBalancer.addMotivation('home', 1);
        }

        this.motiveBalancer.loseMotivation(<ProductType>product.type, 1);
    }

    earn() {
        this.wealth += 25;
        this.earnedThisRest = true;
    }

    click() {
        console.log(this);
    }

    update() {
        if (this.wealth < 0) this.wealth = 0;

        this.updateMotives();

        if (this.atHome && !this.earnedThisRest) this.earn();

        for (let b in buildings) {
            let buildingType = getClass(buildings[b]);
            if (buildingType == 'Billboard' || buildingType == 'Newsstand') {
                if (this.cx > buildings[b].x &&
                    this.cx < buildings[b].x + buildings[b].width &&
                    this.y - 32 > buildings[b].y &&
                    this.y - 32 < buildings[b].y + buildings[b].height) {
                    if (buildings[b].type !== 'empty') {
                        let adType = buildingType == 'Billboard' ? 'billboard' : 'paper';
                        this.motiveBalancer.addMotivation(buildings[b].type, AdManifest[adType].effecitveness);
                    }
                }
            }
        }


        if (this.motive == 'empty') {
            this.wander();
        } else if (this.motive == 'home') {
            if (this.currentPath == paths[4]) {
                this.walkTo({ x: 0, y: 0, width: 32, height: 32 });
            } else if (this.currentPath == paths[20]) {
                this.walkTo({ x: 320, y: 0, width: 32, height: 32 });
            } else {
                this.wander();
            }
        } else {
            let target = buildings.filter(v => getClass(v) == 'Building' && v.type == this.motive)[0];

            let tX = target.x + target.width / 2;
            let tY = target.y + target.height;

            // if outside shop
            if (this.cx >= tX - 10 - this.moveSpeed
                && this.cx <= tX + 10 + this.moveSpeed
                && this.by >= tY - 2
                && this.by <= tY + 32) {

                this.walkTo(target, true);
            } else {
                this.wander();
            }
        }
    }


    draw() {
        if (!this.inside) {
            this.update();

            let f = framecount % 40;
            let frame = 0;
            if (f > 10) frame = 1;
            if (f > 20) frame = 2;
            if (f > 30) frame = 3;

            ctx.drawImage(this.img, 16 * frame, 0, 16, 16, this.x, this.y, this.width, this.height);
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x + (7 / 16) * this.width, this.y + (8 / 16) * this.width, (2 / 16) * this.width, (4 / 16) * this.width);
            // ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

    }
}

class Building {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
    type: ProductType | 'empty';
    img: HTMLImageElement;
    productImg: HTMLImageElement;
    productImgOffsetX;
    productImgOffsetY;
    cost: number;


    constructor(x: number, y: number, scale: number, type: ProductType) {
        this.x = x;
        this.y = y;

        this.scale = scale;

        this.width = 32 * scale;
        this.height = 32 * scale;
        this.type = type;
        this.img = document.createElement('img');
        this.img.src = 'img/building.png';
        this.productImg = document.createElement('img');
        this.productImg.src = `img/${this.type}.png`;

        this.productImgOffsetX = 8;
        this.productImgOffsetY = 2;

        this.cost = ProductManifest[this.type].cost || 0;
    }

    refreshImg() {
        this.productImg.src = `img/${this.type}.png`;
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, 32 * this.scale, 32 * this.scale);
        ctx.drawImage(this.productImg, this.x + this.productImgOffsetX * this.scale, this.y + this.productImgOffsetY * this.scale, 16 * this.scale, 16 * this.scale);
    }
}

class Billboard extends Building {
    acceptedAds: string[];
    droppable: boolean;
    constructor(x, y, s, t) {
        super(x, y, s, t);
        this.img.src = `img/billboard32.png`;
        this.productImgOffsetY = 3;

        this.productImg.src = 'img/billboard.png';
        this.droppable = true;

        this.acceptedAds = ['billboard'];
    }

    drop(ad: ProductSlot) {
        if (getClass(ad) == 'ProductSlot' && this.acceptedAds.indexOf(ad.type) !== -1 && this.type != ad.productType) {
            this.type = ad.productType;
            this.refreshImg();
            return true;
        }
        return false;
    }
}

class Newsstand extends Billboard {
    constructor(x, y, s, t) {
        super(x, y, s, t);
        this.img.src = `img/newsstand.png`;
        this.productImgOffsetY = 2;
        this.productImg.src = 'img/paper.png';
        this.acceptedAds = ['paper'];
    }
}

class House extends Billboard {
    constructor(x, y, s, t) {
        super(x, y, s, t);
        this.img.src = `img/house32.png`;
        this.productImgOffsetY = 0;
        this.productImgOffsetX = 32;
        this.productImg.src = 'img/empty.png';
        this.acceptedAds = ['audio', 'tv'];
    }
}


class Radio extends Billboard {
    constructor(x, y, s, t) {
        super(x, y, s, t);
        this.img.src = `img/radio.png`;
        this.productImgOffsetY = 0;
        this.productImgOffsetX = 32;
        this.productImg.src = 'img/empty.png';
        this.acceptedAds = ['audio'];
    }
}


class TV extends Billboard {
    constructor(x, y, s, t) {
        super(x, y, s, t);
        this.img.src = `img/tv.png`;
        this.productImgOffsetY = 6;
        this.productImgOffsetX = 8;
        this.productImg.src = 'img/empty.png';
        this.acceptedAds = ['tv'];
    }
}

class Path {
    x: number;
    y: number;
    width: number;
    height: number;
    nextPath: Path;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
    }

    get cx() {
        return this.x + this.width / 2;
    }

    get cy() {
        return this.y + this.height / 2;
    }

    draw() {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#696969';
        if (!this.nextPath) ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        // ctx.fillStyle = 'white';
        // ctx.fillText(paths.indexOf(this).toString(), this.x + 16, this.y + 20);
    }
}

class Button {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    img: HTMLImageElement;
    type: ProductType | AdvertType | 'empty';
    draggable: boolean;
    droppable: boolean;

    constructor(x: number, y: number, w: number, h: number, type: AdvertType | ProductType | 'empty') {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;

        this.draggable = false;
        this.droppable = false;

        this.color = 'green';

        this.img = document.createElement('img');
        this.type = type || 'empty';

        this.resetImg();
    }

    resetImg() {
        this.img.src = `img/${this.type}.png`;
    }

    draw() {
        this.update();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        try {
            ctx.drawImage(this.img, this.x + this.width / 2 - 16, this.y + this.height / 2 - 16, 32, 32);
        } catch (e) {
            // console.error(e);
        }
    }

    update() {

    }
}

class ProductButton extends Button {
    slot1: ProductSlot;
    slot2: ProductSlot;
    cost;
    unlocked;
    clickable;

    constructor(x: number, y: number, w: number, h: number, type: ProductType) {
        super(x, y, w, h, type);
        this.color = '#edffed';

        this.droppable = true;

        this.cost = ProductManifest[this.type].unlock;
        this.unlocked = false;

        this.clickable = true;

        this.slot1 = new ProductSlot(this.x + 4, this.y + 4, 48, 48, <ProductType>this.type);
        this.slot2 = new ProductSlot(this.x + 4 + 48 + 4, this.y + 4, 48, 48, <ProductType>this.type);

        slots.push(this.slot1, this.slot2);
    }

    addAdvert(type: AdvertType) {
        if (this.slot1.type == type || this.slot1.type == 'empty') {
            return this.slot1.add(type);
        } else if (this.slot2.type == type || this.slot2.type == 'empty') {
            return this.slot2.add(type);
        } else {
            console.error('slots full!');
            return false;
        }
    }

    unlock(force = false) {
        if (this.unlocked) return;
        if (!force) {
            if (!bank.decrement(this.cost)) return;
        }
        this.unlocked = true;
        let purchased = [];
        products.filter(p => p.unlocked).forEach(p => purchased.push(p.type));
        localStorage.setItem('purchasedProducts', JSON.stringify(purchased));
    }

    drop(ad: AdButton) {
        if (!this.unlocked) return false;
        if (getClass(ad) == 'AdButton') {
            return this.addAdvert(ad.type);
        }
        return false;
    }

    click() {
        this.unlock();
    }

    draw() {
        this.color = !this.unlocked ? '#ff7777' : '#77ff77';
        super.draw();


        this.slot1.draw();
        this.slot2.draw();


        if (!this.unlocked) {
            ctx.fillStyle = '#55000099';
            ctx.fillRect(this.x, this.y, this.width, this.height);

            ctx.fillStyle = 'white';
            ctx.font = '16px monospace';
            ctx.fillText('£' + this.cost, this.x + this.width / 2, this.y + this.height / 2);
        }
    }

}

class ProductSlot extends Button {
    type: AdvertType | 'empty';
    count: number;
    productImg: HTMLImageElement;
    productType: ProductType;
    maxStack: number;

    constructor(x: number, y: number, w: number, h: number, productType: ProductType) {
        super(x, y, w, h, 'empty');
        this.color = '#69696930';
        this.type = 'empty';
        this.count = 0;

        this.productType = productType;

        this.productImg = document.createElement('img');
        this.productImg.src = `img/${productType}.png`;


        this.maxStack = 5;
    }

    add(type: AdvertType) {
        if (this.type == 'empty') {
            this.type = type;
            this.resetImg();
        }
        if (this.type != type) return false;

        if (this.count >= this.maxStack) return false;

        this.count++;

        // console.log(this);

        return true;
    }

    use() {
        this.count--;
        return true;
    }

    update() {
        super.update();
        if (this.count <= 0 && this.type !== 'empty') {
            // empty
            this.type = 'empty';
            this.draggable = false;
            this.count = 0;
            this.color = '#ffffff00';
            this.resetImg();
        } else {
            // we have an ad
            this.color = '#69696930'
            this.draggable = true;
        }
    }

    draw() {
        super.draw();

        // Product type
        if (this.type !== 'empty') {
            ctx.drawImage(this.productImg, this.x + this.width / 2 + 4, this.y + 4);
        }

        if (this.count > 0) {
            // Count
            ctx.beginPath();
            ctx.ellipse(this.x + 8, this.y + 11, 8, 8, 0, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = 'white';
            ctx.fill();

            ctx.font = '16px monospace';
            ctx.fillStyle = 'black';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.fillText(this.count.toString(), this.x + 8, this.y + 16);
            ctx.strokeText(this.count.toString(), this.x + 8, this.y + 16);
        }
    }
}

class AdButton extends Button {
    type: AdvertType;
    cooldown: number;
    useTimer: number;// time in frames
    unlocked: boolean;
    clickable: boolean;
    target: string;
    targetImg: HTMLImageElement;
    runtime:number;

    constructor(x: number, y: number, w: number, h: number, type: AdvertType) {
        super(x, y, w, h, type);
        this.color = '#ededff';

        this.draggable = false;
        this.clickable = true;

        this.unlocked = false;

        this.cooldown = 0;

        this.runtime = 0;

        this.useTimer = AdManifest[this.type].cooldown;

        this.target = AdManifest[this.type].target;

        this.targetImg = document.createElement('img');
        this.targetImg.src = `img/${this.target}.png`;
    }

    use() {
        // console.log('used:', this);
        this.cooldown = 0;
        if (!bank.decrement(AdManifest[this.type].cost)) return false;
    }

    unlock() {
        // console.log('unlock');
        if (this.unlocked) return;
        if (!bank.decrement(AdManifest[this.type].unlock)) return false;
        this.unlocked = true;
        this.runtime = AdManifest[this.type].runtime;
    }

    click() {
        this.unlock();
    }

    update() {
        super.update();
        if (this.cooldown < this.useTimer) {
            this.draggable = false;
            this.cooldown++;
        } else {
            this.draggable = (this.unlocked) ? true : false;
        }

        this.runtime--;
        if (this.runtime <= 0) {
            this.unlocked = false;
            this.runtime = 0;
        }
    }

    draw() {
        super.draw();
        if (this.cooldown < this.useTimer) {
            ctx.fillStyle = '#00000077';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        if (!this.unlocked) {
            ctx.fillStyle = '#55000099';
            ctx.fillRect(this.x, this.y, this.width, this.height);

            ctx.fillStyle = 'white';
            ctx.font = '16px monospace';
            ctx.fillText('£' + AdManifest[this.type].unlock, this.x + this.width / 2, this.y + this.height / 2);
            ctx.fillText(frames2mins(AdManifest[this.type].runtime), this.x + this.width / 2, this.y + this.height / 2 + 16);
        } else {
            ctx.fillStyle = '#00000077';
            ctx.fillRect(this.x,this.y,this.width,this.height - (this.height * (this.runtime / AdManifest[this.type].runtime)))
    
        }

        ctx.drawImage(this.targetImg, 0, 0, this.targetImg.height, this.targetImg.height, this.x - 8 + this.width / 2, this.y - 16, 16, 16);

    }
}

class Bank {
    x;
    y;
    value: number;

    constructor(startValue) {
        this.x = width - 16;
        this.y = 36;
        this.value = Number(startValue);
    }

    increment(amt) {
        this.value += amt;

        localStorage.setItem('bankValue', this.value.toString())
    }

    decrement(amt) {
        // console.log('down ', amt);

        if (this.value - amt < 0) return false;

        this.increment(-amt);
        return true;
    }

    draw() {
        ctx.font = '24px monospace';
        ctx.fillStyle = this.value > 0 ? 'white' : 'red';
        ctx.textAlign = 'right';
        ctx.fillText('£' + Math.floor(this.value), this.x, this.y)
    }
}

class MotiveBalancer {
    // sets 6 values between 0 and 1, keeps total of all values at 1
    coffee: number;
    food: number;
    clothing: number;
    technology: number;
    gambling: number;
    alcohol: number;
    home: number;

    constructor() {
        this.coffee = 0.5;
        this.food = 0.5;
        this.clothing = 0.5;
        this.technology = 0.5;
        this.gambling = 0.5;
        this.alcohol = 0.5;
        this.home = 1;
    }

    get allMotives() {
        return [
            this.coffee, this.clothing, this.alcohol, this.technology, this.gambling, this.food, this.home
        ]
    }

    balance() {
        return;

        let total = this.allMotives.reduce((p, c) => { return p + c });
        let count = 0;
        while (total != 1 && count < 1000) {
            count++;
            for (let p in this) {
                //@ts-ignore
                if (isNaN(this[p])) debugger;
                //@ts-ignore
                if (this[p] < 0) this[p] = 0;
                //@ts-ignore
                (total !== 0) ? this[p] *= 1 / total : this[p] = 0;
            }

            total = this.allMotives.reduce((p, c) => { return p + c });
        }

        // if (total == 0) this.home = 1;

        // console.log('balanced', count);
    }

    addMotivation(type: string, amt: number) {
        this[type] += amt;
        if (this[type] < 0) this[type] = 0;
    }

    loseMotivation(type: string, amt: number) {
        this.addMotivation(type, -amt);
    }

    get currentMotive() {
        let highVal = this.allMotives.sort((a, b) => b - a)[0];
        for (let m in this) {
            if (<number><unknown>this[m] == highVal) return <ProductType>m;
        }
        return 'home';
    }
}

class HUDBackground {
    draw() {
        ctx.fillStyle = 'black';
        ctx.clearRect(0, 0, width, 64);
    }
}

class CashPickup {
    startFrame;
    lifespan;
    x;
    y;
    value;
    dead;
    opacity;

    constructor(x, y, amt) {
        this.startFrame = framecount;
        this.lifespan = 30;
        this.x = x;
        this.y = y;
        this.value = amt;
        this.dead = false;
        this.opacity = 1;
    }

    die() {
        this.dead = true;
        pickups.splice(pickups.indexOf(this), 1);
    }

    update() {
        if (framecount - this.startFrame > this.lifespan) this.die();
        this.y--;
        this.opacity = 1 - ((framecount - this.startFrame) / this.lifespan)
    }

    draw() {
        this.update();

        let tb = ctx.measureText(`+£${this.value}`);

        ctx.fillStyle = `rgba(0,0,0,${this.opacity})`;
        ctx.fillRect(this.x - tb.width / 2, this.y - tb.actualBoundingBoxAscent + 2, tb.width, tb.actualBoundingBoxAscent);

        ctx.strokeStyle = `rgba(255,255,255,${0.5 * this.opacity})`;
        ctx.fillStyle = `rgba(0,255,0,${this.opacity})`;
        ctx.font = '16px monospace';
        ctx.fillText(`+£${this.value}`, this.x, this.y);
        ctx.strokeText(`+£${this.value}`, this.x, this.y);
    }
}

let t = new MotiveBalancer;

let imgPath = `img/text.png`;
let imgSrc = document.createElement('img');
imgSrc.src = imgPath;

let clicks = 0;

let people: Person[] = [];
let products: ProductButton[] = [];
let ads: AdButton[] = [];
let slots: ProductSlot[] = [];
let buildings: Building[] = [];
let paths: Path[] = [];
let hud: any[] = [];
let pickups: any[] = [];

// Order of drawing is order of concat
const allActors = () => [].concat(paths).concat(buildings).concat(people).concat(slots).concat(products).concat(ads).concat(hud).concat(pickups);

let bank: Bank;

let radio: Radio;
let tv: TV;

let population = 20;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let width: number;
let height: number;

let framecount = 0;

let touched: { unlocked: boolean; use: () => void; x: number; width: number; y: number; height: number; };
let tX: number;
let tY: number;

function loaded() {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = false;

    width = canvas.width;
    height = canvas.height;

    canvas.addEventListener('touchstart', touchHandler);
    canvas.addEventListener('click', clickHandler);

    products.push(new ProductButton(10, 272, 108, 56, 'coffee'));
    products.push(new ProductButton(126, 272, 108, 56, 'food'));
    products.push(new ProductButton(242, 272, 108, 56, 'clothing'));

    products.push(new ProductButton(10, 344, 108, 56, 'technology'));
    products.push(new ProductButton(126, 344, 108, 56, 'alcohol'));
    products.push(new ProductButton(242, 344, 108, 56, 'gambling'));

    let storedProducts = JSON.parse(localStorage.getItem('purchasedProducts'));

    if (storedProducts) {
        for (let p of storedProducts) {
            products.forEach(b => {
                if (b.type == p) b.unlock(true);
            })
        }
    }

    products[0].unlock(true);

    buildings.push(new Building(34 - 6, 64, 2, 'food'));
    buildings.push(new Building(92 - 6, 64, 2, 'coffee'));

    buildings.push(new Newsstand(150 - 8, 64, 2, 'empty'));

    buildings.push(new Building(204 - 6, 64, 2, 'clothing'));
    buildings.push(new Billboard(262, 64, 2, 'empty'));

    // line 2


    buildings.push(new Billboard(34, 160, 2, 'empty'));
    buildings.push(new Building(104 - 6, 160, 2, 'alcohol'));
    buildings.push(new Building(162 - 6, 160, 2, 'gambling'));

    buildings.push(new Newsstand(220 - 8, 160, 2, 'empty'));

    buildings.push(new Building(274 - 6, 160, 2, 'technology'));


    ads.push(new AdButton(16, 424, 48, 48, 'text'));
    ads.push(new AdButton(72, 424, 48, 48, 'audio'));
    ads.push(new AdButton(128, 424, 48, 48, 'video'));
    ads.push(new AdButton(184, 424, 48, 48, 'paper'));
    ads.push(new AdButton(240, 424, 48, 48, 'billboard'));
    ads.push(new AdButton(296, 424, 48, 48, 'tv'));


    hud.push(new HUDBackground);

    let storedVal = localStorage.getItem('bankValue');
    bank = storedVal ? new Bank(storedVal) : new Bank(1000);

    hud.push(bank);

    tv = new TV(80, 16, 1, 'empty');
    radio = new Radio(16, 16, 1, 'empty')
    hud.push(tv)
    hud.push(radio)


    let lastPath;

    let pathX = 1;
    let pathY = 0;

    let lrMargin = 0.8;

    // path down
    for (let i = 0; i < 8; i++) {
        pathY = i * 32;
        let newPath = new Path(pathX, pathY);
        if (!lastPath) {
            console.log(i);
        } else {
            lastPath.nextPath = newPath;
        }

        paths.push(newPath);

        lastPath = newPath;
    }

    // path right
    for (let i = 0; i < 10; i++) {
        pathX = 32 + i * (32 + lrMargin);
        let newPath = new Path(pathX, pathY);
        if (!lastPath) {
            console.log(i);
        } else {
            lastPath.nextPath = newPath;
        }

        paths.push(newPath);

        lastPath = newPath;
    }

    // path up
    for (let i = 0; i < 3; i++) {
        pathY -= 32;

        let newPath = new Path(pathX, pathY)//224 - 32 - i * 32);
        if (!lastPath) {
            console.log(i);
        } else {
            lastPath.nextPath = newPath;
        }

        paths.push(newPath);

        lastPath = newPath;
    }

    // path left
    for (let i = 0; i < 9; i++) {
        pathX -= 32 + lrMargin;
        let newPath = new Path(pathX, pathY);
        if (!lastPath) {
            console.log(i);
        } else {
            lastPath.nextPath = newPath;
        }

        paths.push(newPath);

        lastPath = newPath;
    }

    pathX = paths[20].x;
    // up to home right
    for (let i = 0; i < 4; i++) {
        pathY -= 32;

        let newPath = new Path(pathX, pathY);
        if (!lastPath) {
            console.log(i);
        } else {
            lastPath.nextPath = newPath;
        }

        paths.push(newPath);

        lastPath = newPath;
    }

    paths[33].nextPath = paths[20];
    // finish loop
    paths[29].nextPath = paths[4];


    for (let i = 0; i < population; i++) {
        people.push(new Person);
    }

    ads[0].type = 'text';

    requestAnimationFrame(rafDrawLoop);
}

function clickHandler(e: MouseEvent) {
    let x = e.offsetX;
    let y = e.offsetY;

    let target;

    for (let a of allActors()) {
        if (a.clickable && x > a.x && x < a.x + a.width && y > a.y && y < a.y + a.height) target = a;
    }

    if (target) target.click();
}

function touchHandler(e: TouchEvent) {
    // console.log('touchstart');
    let touch = e.touches[0];
    let cnvBB = canvas.getBoundingClientRect();
    let x = touch.pageX - cnvBB.x;
    let y = touch.pageY - cnvBB.y;

    touched = undefined;

    for (let a of allActors()) {
        if (a.draggable && x > a.x && x < a.x + a.width && y > a.y && y < a.y + a.height) touched = a;
    }

    if (touched) {
        // touched.click();

        tX = undefined;
        tY = undefined;

        const moveHandler = (e: TouchEvent) => {
            // console.log('touchmove');
            let touch = e.touches[0];
            let cnvBB = canvas.getBoundingClientRect();
            tX = touch.pageX - cnvBB.x;
            tY = touch.pageY - cnvBB.y;
        }

        const dropHandler = (e: any) => {
            // console.log('touchend');
            canvas.removeEventListener('touchmove', moveHandler);
            canvas.removeEventListener('touchend', dropHandler);

            function dropThing() {
                let target: { drop: (arg0: any) => any; };

                for (let a of allActors()) {
                    if (a.droppable && tX > a.x && tX < a.x + a.width && tY > a.y && tY < a.y + a.height) target = a;
                }

                if (target && target.drop(touched)) touched.use();
            }

            if (getClass(touched) == 'AdButton' && touched.unlocked) {
                dropThing();
            } else {
                dropThing();
            }



            touched = undefined;
            tX = undefined;
            tY = undefined;
        }

        canvas.addEventListener('touchmove', moveHandler);

        canvas.addEventListener('touchend', dropHandler);
    }
}

function rafDrawLoop(t: DOMHighResTimeStamp) {
    ctx.clearRect(0, 0, width, height);

    for (let a of allActors()) {
        ctx.textAlign = 'center';
        a.draw();
    }

    if (touched) {
        // draw line from touched to us
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.moveTo(touched.x + touched.width / 2, touched.y + touched.height / 2);
        ctx.lineTo(tX, tY);
        ctx.stroke();
        ctx.closePath();
    }

    framecount++;

    requestAnimationFrame(rafDrawLoop);
}

function clearSave() {
    localStorage.clear();
    location.href = location.href;
}