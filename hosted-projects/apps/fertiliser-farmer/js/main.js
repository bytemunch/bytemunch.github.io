import { makeNoise3D } from '../lib/osn.js';
import { Sprite } from './class/Sprite.js';
import { Tile, newTileFromJSON } from './class/Tile.js';
import { Item, newItemFromJSON } from './class/Item.js';
import { Camera } from './class/Camera.js';
import { UIElement, Bank, CoinDisplay, XPDisplay, XPBall, PlayButton, InventoryButton, LevelUpScreen, ToolSelector, MenuButton } from './class/UIElements.js';
import { Chicken, newAnimalFromJSON } from './class/Animal.js';
import { Inventory } from './class/Inventory.js';
import { Coin, XPDrop } from './class/Drop.js';
import { HandTool } from './class/HandTool.js';
import { AntiFog } from './class/AntiFog.js';
export let DEBUG = {
    boundingBoxes: false,
    showInfo: true,
    editVars: true
};
// br1 ================================= INIT ====================================
let version;
(async () => {
    version = await (await fetch('./version')).text();
})();
export let LAYERNUMBERS = {
    tile: 0,
    item: 1,
    animal: 1,
    ui: 2,
    debug: 3
};
const TILE_FRAMERATE = 3;
export let layers = [];
export let extraActors = [];
let numLayers = 4;
// Initialise canvases
for (let i = 0; i < numLayers; i++) {
    let newCnv = document.createElement('canvas');
    let opts = {};
    if (i == 0)
        opts = { alpha: false };
    layers.push({ cnv: newCnv, ctx: newCnv.getContext('2d', opts) });
}
window.addEventListener('resize', () => {
    let dpi = devicePixelRatio;
    targetBB = contentDiv.getBoundingClientRect();
    for (let c of layers) {
        c.cnv.height = Math.floor(targetBB.height * dpi);
        c.cnv.width = Math.floor(targetBB.width * dpi);
    }
    camera.resized();
    UIElements.forEach(el => el.updatePosition());
});
let contentDiv;
let loop = false;
let state = '';
export let inventory = new Inventory();
export let worldWidth = 50;
export let worldHeight = worldWidth * 2;
export let dropManifest = {
    coin: Coin,
    poop: Item,
    xp: XPDrop
};
export let itemManifest = {
    'poop': {
        maxLevel: 5,
        dropTable: {
            coin: [3, 5],
            [`poop-1`]: [1, 3],
            xp: [50, 50]
        }
    },
    'gold_poop': {
        maxLevel: 5,
        dropTable: {
            coin: [30, 50],
            [`gold_poop-1`]: [1, 3],
            xp: [150, 150]
        }
    },
};
export let levelManifest = {
    1: {
        rewards: {
            'antifog': 10
        }
    }
};
export const xpBoundaryForLevel = level => {
    return 100 * level * (level / 2);
};
export const xpToCurrentLevel = xp => {
    return Math.floor(Math.sqrt(2 * xp / 100));
};
export const randInRange = (min, max) => {
    return Math.floor(min + (Math.random() * (max - min + 1)));
};
export let coins = 0;
export const addCoins = n => {
    coins += n;
    saveGame();
};
export let xp = 0;
export const addXp = n => {
    let prevLvl = xpToCurrentLevel(xp);
    xp += n;
    let nextLvl = xpToCurrentLevel(xp);
    if (prevLvl < nextLvl) {
        levelUp();
    }
    saveGame();
};
export let tools = {
    antifog: new AntiFog,
    hand: new HandTool,
};
export let tool = 'hand';
export const changeTool = (toolName) => {
    tool = toolName;
};
export const nextTool = () => {
    let tIDs = Object.keys(tools);
    let count = tIDs.length;
    let cIdx = tIDs.indexOf(tool);
    if (cIdx >= count - 1) {
        tool = tIDs[0];
    }
    else {
        tool = tIDs[cIdx + 1];
    }
};
const levelUp = () => {
    let lvl = xpToCurrentLevel(xp);
    if (!levelManifest[lvl]) {
        console.error('Rewards not implemented for level ' + lvl);
    }
    // create reward screen
    UIElements.push(new LevelUpScreen);
    // console.log('Reward screen not implemented!', levelManifest[lvl]);
};
export let camera;
export let sprites = {};
export let tileGrid = [];
export let UIElements = [];
export let animals = [];
document.addEventListener('DOMContentLoaded', () => {
    loaded();
    if (DEBUG.editVars) {
        globalThis.addXp = addXp;
        globalThis.xpToCurrentLevel = xpToCurrentLevel;
        globalThis.addChickenAtPos = pos => {
            animals.push(new Chicken(pos));
        };
        globalThis.camera = camera;
    }
});
const loadSprites = () => {
    let loadPromises = [];
    sprites.grass = new Sprite('./img/tiles/grass.png', 64, 96);
    loadPromises.push(sprites.grass.ready);
    sprites.water = new Sprite('./img/tiles/water.png', 64, 32);
    sprites.water.frameRate = TILE_FRAMERATE;
    loadPromises.push(sprites.water.ready);
    sprites.fog = new Sprite('./img/tiles/fog.png', 64, 96);
    loadPromises.push(sprites.fog.ready);
    for (let i in itemManifest) {
        for (let j = 1; j <= itemManifest[i].maxLevel; j++) {
            sprites[`${i}-${j}`] = new Sprite(`./img/items/${i}/${i}-${j}.png`);
            loadPromises.push(sprites[`${i}-${j}`].ready);
        }
    }
    sprites['animal-chicken'] = new Sprite('./img/animals/chicken.png', 32, 32);
    sprites.bank = new Sprite(`./img/graphics/bank.png`, 64, 64);
    loadPromises.push(sprites.bank.ready);
    sprites.tool_select = new Sprite(`./img/graphics/tool_select.png`, 64, 64);
    loadPromises.push(sprites.tool_select.ready);
    sprites.hand = new Sprite(`./img/graphics/hand.png`, 64, 64);
    loadPromises.push(sprites.hand.ready);
    sprites.antifog = new Sprite(`./img/graphics/antifog.png`, 64, 64);
    loadPromises.push(sprites.antifog.ready);
    sprites.inventory = new Sprite(`./img/graphics/inventory.png`, 64, 64);
    loadPromises.push(sprites.inventory.ready);
    sprites.coin = new Sprite('./img/items/coin.png', 16, 16);
    sprites.coin.frameRate = 20;
    loadPromises.push(sprites.coin.ready);
    sprites.xp = new Sprite('./img/items/xp.png', 16, 16);
    sprites.xp.frameRate = 20;
    loadPromises.push(sprites.xp.ready);
    sprites.xporb = new Sprite('./img/graphics/xporb.png', 64, 64);
    sprites.xporb.animate = 'stepped';
    loadPromises.push(sprites.xporb.ready);
    sprites.playButton = new Sprite('./img/graphics/btn_play.png', 182, 112);
    loadPromises.push(sprites.playButton.ready);
    sprites.menuButton = new Sprite('./img/graphics/btn_menu.png', 92, 60);
    loadPromises.push(sprites.menuButton.ready);
    sprites.clearButton = new Sprite('./img/graphics/btn_clear.png', 92, 60);
    loadPromises.push(sprites.clearButton.ready);
    sprites.clearButtonInactive = new Sprite('./img/graphics/btn_clear_inactive.png', 92, 60);
    loadPromises.push(sprites.clearButtonInactive.ready);
    sprites.title = new Sprite('./img/graphics/title.png', 320, 184);
    loadPromises.push(sprites.title.ready);
    sprites.close = new Sprite('./img/graphics/close.png', 32, 32);
    loadPromises.push(sprites.close.ready);
    return Promise.allSettled(loadPromises);
};
// br2 ========================== SAVELOAD =================================
let saving;
export const saveGame = (force) => {
    clearTimeout(saving);
    saving = setTimeout(() => {
        let saveData = [];
        for (let i = 0; i < tileGrid.length; i++) {
            saveData[i] = [];
            for (let j = 0; j < tileGrid[i].length; j++) {
                saveData[i][j] = {
                    contents: tileGrid[i][j].contents ? tileGrid[i][j].contents.toJSON() : null,
                    tile: tileGrid[i][j].tile.toJSON()
                };
            }
        }
        let fullState = {
            coins: coins,
            xp: xp,
            tileGrid: saveData,
            inventory: inventory.toJSON(),
            animals: animals,
            tools: tools,
            expandableSpaceHere: true
        };
        localStorage.setItem('save', JSON.stringify(fullState));
        console.info('Game saved!');
    }, force ? 0 : 1000);
};
const loadGame = () => {
    cleanupArrays();
    let saveData = JSON.parse(localStorage.getItem('save'));
    coins = saveData.coins;
    xp = saveData.xp;
    inventory.contents = saveData.inventory || {};
    tools.antifog.addUses(saveData.tools.antifog.uses);
    for (let animal of saveData.animals) {
        animals.push(newAnimalFromJSON(animal));
    }
    for (let i = 0; i < saveData.tileGrid.length; i++) {
        tileGrid[i] = [];
        for (let j = 0; j < saveData.tileGrid[i].length; j++) {
            tileGrid[i][j] = {
                contents: saveData.tileGrid[i][j].contents ? newItemFromJSON(saveData.tileGrid[i][j].contents) : null,
                tile: newTileFromJSON(saveData.tileGrid[i][j].tile)
            };
        }
    }
};
// br3 ========================== FLOW =================================
const startLoop = () => {
    loop = true;
    requestAnimationFrame(mainLoop);
    requestAnimationFrame(drawTiles);
    requestAnimationFrame(drawItems);
    requestAnimationFrame(updateItems);
    requestAnimationFrame(updateTiles);
};
const addGameUI = () => {
    UIElements = [];
    UIElements.push(new Bank({
        right: 0,
        width: 64,
        height: 64,
        type: 'bank',
        sprite: sprites.bank
    }));
    UIElements.push(new ToolSelector({
        left: 0,
        top: layers[0].cnv.height - 64,
        width: 64,
        height: 64,
        type: 'tool_select',
        sprite: sprites.tool_select
    }));
    UIElements.push(new InventoryButton({
        centerX: true,
        width: 64,
        height: 64,
        type: 'inventory',
        sprite: sprites.inventory
    }));
    UIElements.push(new CoinDisplay({
        right: 64,
        width: 120,
        height: 20,
        type: 'coindisplay',
        sprite: sprites.coin
    }));
    UIElements.push(new XPDisplay({
        left: 64,
        width: 120,
        height: 20,
        type: 'xpdisplay',
        sprite: sprites.xp
    }));
    UIElements.push(new XPBall({
        left: 0,
        width: 64,
        height: 64,
        type: 'xporb',
        sprite: sprites.xporb
    }));
};
export const startGame = () => {
    clearLayer('ui');
    if (localStorage.getItem('save') == null) {
        createNewGame();
    }
    else {
        loadGame();
    }
    addGameUI();
    state = 'playing';
    //@ts-ignore yes typesctipt I can set the location directly fuck offffffff
    window.location = '#' + state;
};
window.addEventListener('popstate', () => {
    if (state == location.hash.replace('#', ''))
        return;
    state = location.hash.replace('#', '');
    switch (state) {
        case 'playing':
            startGame();
            break;
        case 'mainmenu':
            createMainMenu();
            break;
        default:
            console.error('Hash not found!', state);
    }
});
const createMainMenu = () => {
    cleanupArrays();
    clearLayer('ui');
    state = 'mainmenu';
    //@ts-ignore yes typesctipt I can set the location directly fuck offffffff
    window.location = '#' + state;
    UIElements.push(new PlayButton({
        height: 48 * 2,
        width: 78 * 2,
        centerX: true,
        bottom: layers[0].cnv.height * 0.05,
        sprite: sprites.playButton,
        type: 'play'
    }));
    UIElements.push(new MenuButton({
        height: 60,
        width: 92,
        top: 10,
        right: 10,
        sprite: sprites.menuButton,
        type: 'menu'
    }));
    UIElements.push(new UIElement({
        height: 92 * 2,
        width: 160 * 2,
        centerX: true,
        top: layers[0].cnv.height * 0.05,
        sprite: sprites.title,
        type: 'title'
    }));
};
const loaded = async () => {
    contentDiv = document.querySelector('#content');
    let cBB = contentDiv.getBoundingClientRect();
    let cBBStyle = getComputedStyle(contentDiv);
    let gameW = cBB.width - Number(cBBStyle.borderWidth.replace('px', '')) * 2 - Number(cBBStyle.paddingLeft.replace('px', '')) - Number(cBBStyle.paddingRight.replace('px', ''));
    let gameH = cBB.height - Number(cBBStyle.borderWidth.replace('px', '')) * 2 - Number(cBBStyle.paddingTop.replace('px', '')) - Number(cBBStyle.paddingBottom.replace('px', ''));
    for (let c of layers) {
        c.cnv.width = gameW;
        c.cnv.height = gameH;
    }
    camera = new Camera;
    for (let c of layers) {
        contentDiv.appendChild(c.cnv);
    }
    await loadSprites();
    // start making tiles here
    // initialize array
    for (let i = 0; i < worldWidth; i++) {
        tileGrid[i] = [];
    }
    contentDiv.addEventListener('touchstart', touched);
    createMainMenu();
    startLoop();
};
const cleanupArrays = () => {
    coins = 0;
    xp = 0;
    inventory = new Inventory;
    animals = [];
    tools = {
        antifog: new AntiFog,
        hand: new HandTool,
    };
    UIElements = [];
    for (let i = 0; i < worldWidth; i++) {
        for (let j = 0; j < worldHeight; j++) {
            tileGrid[i][j] = {
                contents: null,
                tile: new Tile({
                    gridPosition: { gridX: i, gridY: j },
                    sprite: sprites.water,
                    type: 'water'
                })
            };
        }
    }
};
// new game
const createNewGame = () => {
    cleanupArrays();
    let waterHBorder = 1;
    let waterVBorder = 6;
    let seed = Math.floor(Math.random() * 1234567);
    const noiseGen = makeNoise3D(seed);
    for (let i = waterHBorder; i < worldWidth - waterHBorder; i++) {
        for (let j = waterVBorder; j < worldHeight - waterVBorder; j++) {
            const noiseScale = 20;
            let itemSize = 5; //Math.floor(1 + Math.random() * 5);
            let item = Math.random() > 0.5 ? 'poop' : 'gold_poop';
            if (noiseGen(i / noiseScale, j / noiseScale, 100) > 0) {
                let tile;
                if (i < worldWidth / 2 && j < worldHeight / 2) {
                    tile = new Tile({
                        gridPosition: { gridX: i, gridY: j },
                        sprite: sprites.grass,
                        droppable: true,
                        type: 'grass',
                    });
                }
                else {
                    tile = new Tile({
                        gridPosition: { gridX: i, gridY: j },
                        sprite: sprites.fog,
                        droppable: false,
                        type: 'fog',
                    });
                }
                tileGrid[i][j] = {
                    tile,
                    contents: Math.random() < 0.1 ? new Item({
                        gridPosition: { gridX: i, gridY: j },
                        sprite: sprites[`${item}-${itemSize}`],
                        type: item,
                        level: itemSize
                    }) : null,
                };
            }
        }
    }
    saveGame(true);
};
// br4 ================= DRAWING ================================
let fps = 0;
let lastT = 0;
let frameTime = 0;
export let fElapsedTime = 0;
export let frameCount = 0;
let prevFPSs = [];
let avgFps;
const avg = (arr) => {
    let rt = 0;
    for (let a of arr) {
        rt += a;
    }
    return rt / arr.length;
};
let drawnObjs = 0;
export const clearLayer = l => {
    if (typeof l == 'string')
        l = LAYERNUMBERS[l];
    layers[l].ctx.clearRect(0, 0, layers[l].cnv.width, layers[l].cnv.height);
};
const drawTiles = () => {
    if (camera.moved || frameCount % Math.floor(60 / TILE_FRAMERATE) == 0) {
        camera.drawObjects(tileGrid.flat().filter(t => t.tile.visible).sort((a, b) => (a.tile.y - b.tile.y)).map(gt => gt.tile));
        camera.moved = false;
    }
    if (loop)
        requestAnimationFrame(drawTiles);
};
const updateTiles = () => {
    tileGrid.forEach(col => col.forEach(i => i.tile.update()));
    if (loop)
        requestAnimationFrame(updateTiles);
};
const drawItems = () => {
    clearLayer('item');
    camera.drawObjects(tileGrid.flat().filter(t => t.contents?.visible).sort((a, b) => (a.contents.y - b.contents.y)).map(gt => gt.contents));
    camera.drawObjects(extraActors);
    if (loop)
        requestAnimationFrame(drawItems);
};
const updateItems = () => {
    tileGrid.forEach(col => col.filter(t => t.contents).forEach(i => i.contents.update()));
    extraActors.forEach(a => { if (a.removeNextDraw)
        a.destroy(); });
    extraActors.forEach(i => i.update());
    if (loop)
        requestAnimationFrame(updateItems);
};
const drawUI = () => {
    drawnObjs = 0;
    // UI
    UIElements.forEach(el => { if (el.removeNextDraw)
        el.destroy(); });
    for (let el of UIElements.sort((a, b) => a.z - b.z)) {
        el.clear();
        el.draw();
    }
    // if (frameCount % 100 == 0) console.log(flatArray.length, UIElements.length, drawnObjs + UIElements.length)
};
const drawDebug = () => {
    fps = 1000 / frameTime;
    prevFPSs.push(fps);
    if (prevFPSs.length > 30)
        prevFPSs.shift();
    avgFps = avg(prevFPSs);
    let ctx = layers[LAYERNUMBERS.debug].ctx;
    //DEBUG
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.clearRect(0, layers[0].cnv.height - 20, layers[0].cnv.width, 20);
    ctx.fillRect(0, layers[0].cnv.height - 20, layers[0].cnv.width, 20);
    ctx.fillStyle = 'white';
    ctx.font = '16px monospace';
    ctx.fillText('FPS: ' + avgFps.toFixed(2), 10, layers[0].cnv.height - 4);
    ctx.fillText('rev' + version, layers[0].cnv.width - 120, layers[0].cnv.height - 4);
    ctx.fillText(`[${((camera.x + camera.viewWidth / 2) - 32).toPrecision(4)},${((camera.y + camera.viewHeight / 2) - 48).toPrecision(4)}]`, layers[0].cnv.width / 2, layers[0].cnv.height - 4);
    ctx.fillText(`{${drawnObjs}:${UIElements.length}}`, 128, layers[0].cnv.height - 4);
    ctx.fillText(`Touchscreen Only`, 300, layers[0].cnv.height - 4);
    // Crosshair
    // ctx.beginPath();
    // ctx.moveTo(layers[0].cnv.width / 2, 0);
    // ctx.lineTo(layers[0].cnv.width / 2, layers[0].cnv.height - 20);
    // ctx.moveTo(0, layers[0].cnv.height / 2);
    // ctx.lineTo(layers[0].cnv.width, layers[0].cnv.height / 2);
    // ctx.stroke();
    // ctx.closePath();
};
const mainLoop = (t) => {
    frameTime = t - lastT;
    lastT = t;
    fElapsedTime = frameTime / 100;
    for (let s in sprites) {
        sprites[s].draw();
    }
    drawUI();
    handleInput();
    if (DEBUG.showInfo) {
        drawDebug();
    }
    frameCount++;
    if (loop) {
        requestAnimationFrame(mainLoop);
    }
};
// br5 ================= INPUT ================================
let keysHeld = {};
document.addEventListener('keydown', e => {
    keysHeld[e.key.toLowerCase()] = true;
    if (e.key == 'n') {
        createNewGame();
    }
});
document.addEventListener('keyup', e => {
    keysHeld[e.key.toLowerCase()] = false;
});
// do this in-class?
const handleInput = () => {
    let moveSpeed = 70 * fElapsedTime;
    if (keysHeld['shift'])
        moveSpeed = 140 * fElapsedTime;
    if (keysHeld['w']) {
        camera.move(0, -moveSpeed);
    }
    else if (keysHeld['s']) {
        camera.move(0, moveSpeed);
    }
    if (keysHeld['a']) {
        camera.move(-moveSpeed, 0);
    }
    else if (keysHeld['d']) {
        camera.move(moveSpeed, 0);
    }
    if (keysHeld['+'] || keysHeld['=']) {
        camera.scale += 0.01;
        camera.moved = true;
    }
    else if (keysHeld['-']) {
        camera.scale -= 0.01;
        camera.moved = true;
    }
};
export const pickup = (dragged, callback) => {
    // item dragging listeners
    let x = 0;
    let y = 0;
    extraActors.push(dragged);
    const moveHandler = e => {
        e.preventDefault();
        camera.moved = true; // force tile redraw
        if (dragged.gridX != -1 && dragged.gridY != -1)
            tileGrid[dragged.gridX][dragged.gridY].contents = null;
        x = e.touches[0].pageX - targetBB.x + camera.x;
        y = e.touches[0].pageY - targetBB.y + camera.y;
        if (x > layers[0].cnv.width * 0.9 + camera.x)
            camera.move(5, 0);
        if (x < layers[0].cnv.width * 0.1 + camera.x)
            camera.move(-5, 0);
        if (y > layers[0].cnv.height * 0.9 + camera.y)
            camera.move(0, 5);
        if (y < layers[0].cnv.height * 0.1 + camera.y)
            camera.move(0, -5);
        dragged._x = (x * 1 / camera.scale) - dragged.width / 2 * camera.scale;
        dragged._y = (y * 1 / camera.scale) - dragged.width / 2 * camera.scale;
        for (let gtile of tileGrid.flat()) {
            let tile = gtile.tile;
            if (!tile.droppable)
                continue;
            tile.draggedOver = false;
            if (tile.collides(x, y)) {
                tile.draggedOver = true;
            }
        }
    };
    const endHandler = e => {
        e.preventDefault();
        let goodMove = false;
        camera.moved = true; // force tile redraw
        for (let gtile of tileGrid.flat()) {
            let tile = gtile.tile;
            if (!tile.droppable)
                continue;
            tile.draggedOver = false;
            if (tile.collides(x, y)) {
                if (tile.contents && (tile.contents.type !== dragged.type || tile.contents.level !== dragged.level))
                    continue;
                const moveItem = () => {
                    tileGrid[tile.gridX][tile.gridY].contents = dragged;
                    // set dragged position to dropped grid
                    dragged.gridX = tile.gridX;
                    dragged.gridY = tile.gridY;
                    goodMove = true;
                };
                if (tile.contents && tile.contents.type == dragged.type) {
                    if (tile.contents.level == dragged.level && dragged.merge(tile.contents)) {
                        goodMove = true;
                    }
                }
                else {
                    moveItem();
                }
                break;
            }
        }
        dragged._x = false;
        dragged._y = false;
        contentDiv.removeEventListener('touchmove', moveHandler);
        contentDiv.removeEventListener('touchend', endHandler);
        if (callback)
            callback(false);
        extraActors.splice(extraActors.indexOf(dragged), 1);
        if (callback)
            callback(goodMove);
        if (!goodMove) {
            if (dragged.gridX != -1 && dragged.gridY != -1)
                tileGrid[dragged.gridX][dragged.gridY].contents = dragged;
        }
        saveGame();
    };
    contentDiv.addEventListener('touchmove', moveHandler);
    contentDiv.addEventListener('touchend', endHandler);
    return true;
};
export const itemTouchListeners = (x, y) => {
    for (let gtile of tileGrid.flat()) {
        let actor = gtile.contents;
        if (actor && actor.draggable && actor.collides(x, y)) {
            pickup(actor);
            return true;
        }
    }
    return false;
};
let cameraTouchListeners = (x, y, targetBB, startX, startY) => {
    // camera move listeners
    const cameraMoveHandler = e => {
        e.preventDefault();
        x = e.touches[0].pageX - targetBB.x + camera.x;
        y = e.touches[0].pageY - targetBB.y + camera.y;
        camera.move(startX - x, startY - y);
    };
    const cameraEndHandler = e => {
        e.preventDefault();
        contentDiv.removeEventListener('touchmove', cameraMoveHandler);
        contentDiv.removeEventListener('touchend', cameraEndHandler);
    };
    contentDiv.addEventListener('touchmove', cameraMoveHandler);
    contentDiv.addEventListener('touchend', cameraEndHandler);
};
const uiTouchListeners = (x, y) => {
    for (let el of UIElements.sort((a, b) => b.x - a.x)) {
        if (el.collidePoint(x, y)) {
            if (!el.interactable)
                return true; // eat input
            el.act();
            return true;
        }
    }
    return false;
};
export const animalTouchListeners = (x, y) => {
    console.log('Animal touch listeners not implemented!');
    return false;
};
let targetBB = layers[0].cnv.getBoundingClientRect();
const touched = e => {
    e.preventDefault();
    let startX = e.touches[0].pageX - targetBB.x + camera.x;
    let startY = e.touches[0].pageY - targetBB.y + camera.y;
    let x = startX;
    let y = startY;
    if (uiTouchListeners(e.touches[0].pageX - targetBB.x, e.touches[0].pageY - targetBB.y)) {
        return;
    }
    if (state == 'playing') {
        if (tools[tool].act(x, y))
            return;
        cameraTouchListeners(x, y, targetBB, startX, startY);
    }
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QyxLQUFLLElBQUksQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBRXZHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUUvQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQztZQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQztZQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENB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QUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNwRixPQUFPO0tBQ1Y7SUFFRCxJQUFJLEtBQUssSUFBSSxTQUFTLEVBQUU7UUFDcEIsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFBRSxPQUFPO1FBQ2xDLG9CQUFvQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUN4RDtBQUNMLENBQUMsQ0FBQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbWFrZU5vaXNlM0QgfSBmcm9tICcuLi9saWIvb3NuLmpzJztcbmltcG9ydCB7IFNwcml0ZSB9IGZyb20gJy4vY2xhc3MvU3ByaXRlLmpzJztcbmltcG9ydCB7IFRpbGUsIG5ld1RpbGVGcm9tSlNPTiB9IGZyb20gJy4vY2xhc3MvVGlsZS5qcyc7XG5pbXBvcnQgeyBJdGVtLCBuZXdJdGVtRnJvbUpTT04gfSBmcm9tICcuL2NsYXNzL0l0ZW0uanMnO1xuaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSAnLi9jbGFzcy9DYW1lcmEuanMnO1xuaW1wb3J0IHsgVUlFbGVtZW50LCBCYW5rLCBDb2luRGlzcGxheSwgWFBEaXNwbGF5LCBYUEJhbGwsIFBsYXlCdXR0b24sIEludmVudG9yeUJ1dHRvbiwgTGV2ZWxVcFNjcmVlbiwgVG9vbFNlbGVjdG9yLCBNZW51QnV0dG9uIH0gZnJvbSAnLi9jbGFzcy9VSUVsZW1lbnRzLmpzJztcbmltcG9ydCB7IEFuaW1hbCwgQ2hpY2tlbiwgbmV3QW5pbWFsRnJvbUpTT04gfSBmcm9tICcuL2NsYXNzL0FuaW1hbC5qcyc7XG5pbXBvcnQgeyBJbnZlbnRvcnkgfSBmcm9tICcuL2NsYXNzL0ludmVudG9yeS5qcyc7XG5pbXBvcnQgeyBDb2luLCBYUERyb3AgfSBmcm9tICcuL2NsYXNzL0Ryb3AuanMnO1xuaW1wb3J0IHsgSGFuZFRvb2wgfSBmcm9tICcuL2NsYXNzL0hhbmRUb29sLmpzJztcbmltcG9ydCB7IEFudGlGb2cgfSBmcm9tICcuL2NsYXNzL0FudGlGb2cuanMnO1xuXG5leHBvcnQgbGV0IERFQlVHID0ge1xuICAgIGJvdW5kaW5nQm94ZXM6IGZhbHNlLFxuICAgIHNob3dJbmZvOiB0cnVlLFxuICAgIGVkaXRWYXJzOiB0cnVlXG59XG5cbi8vIGJyMSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gSU5JVCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxubGV0IHZlcnNpb247XG5cbihhc3luYyAoKSA9PiB7XG4gICAgdmVyc2lvbiA9IGF3YWl0IChhd2FpdCBmZXRjaCgnLi92ZXJzaW9uJykpLnRleHQoKTtcbn0pKCk7XG5cbmV4cG9ydCBsZXQgTEFZRVJOVU1CRVJTID0ge1xuICAgIHRpbGU6IDAsXG4gICAgaXRlbTogMSxcbiAgICBhbmltYWw6IDEsXG4gICAgdWk6IDIsXG4gICAgZGVidWc6IDNcbn1cblxuY29uc3QgVElMRV9GUkFNRVJBVEUgPSAzO1xuXG5leHBvcnQgbGV0IGxheWVycyA9IFtdO1xuZXhwb3J0IGxldCBleHRyYUFjdG9ycyA9IFtdO1xuXG5sZXQgbnVtTGF5ZXJzID0gNDtcblxuLy8gSW5pdGlhbGlzZSBjYW52YXNlc1xuZm9yIChsZXQgaSA9IDA7IGkgPCBudW1MYXllcnM7IGkrKykge1xuICAgIGxldCBuZXdDbnYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBsZXQgb3B0cyA9IHt9O1xuICAgIGlmIChpID09IDApIG9wdHMgPSB7IGFscGhhOiBmYWxzZSB9O1xuICAgIGxheWVycy5wdXNoKHsgY252OiBuZXdDbnYsIGN0eDogbmV3Q252LmdldENvbnRleHQoJzJkJywgb3B0cykgfSk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgbGV0IGRwaSA9IGRldmljZVBpeGVsUmF0aW87XG4gICAgdGFyZ2V0QkIgPSBjb250ZW50RGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgZm9yIChsZXQgYyBvZiBsYXllcnMpIHtcbiAgICAgICAgYy5jbnYuaGVpZ2h0ID0gTWF0aC5mbG9vcih0YXJnZXRCQi5oZWlnaHQgKiBkcGkpO1xuICAgICAgICBjLmNudi53aWR0aCA9IE1hdGguZmxvb3IodGFyZ2V0QkIud2lkdGggKiBkcGkpO1xuICAgIH1cblxuICAgIGNhbWVyYS5yZXNpemVkKCk7XG5cbiAgICBVSUVsZW1lbnRzLmZvckVhY2goZWwgPT4gZWwudXBkYXRlUG9zaXRpb24oKSlcbn0pXG5cbmxldCBjb250ZW50RGl2OiBIVE1MRGl2RWxlbWVudDtcblxubGV0IGxvb3AgPSBmYWxzZTtcblxubGV0IHN0YXRlID0gJyc7XG5cbmV4cG9ydCBsZXQgaW52ZW50b3J5ID0gbmV3IEludmVudG9yeSgpO1xuXG5leHBvcnQgbGV0IHdvcmxkV2lkdGggPSA1MDtcblxuZXhwb3J0IGxldCB3b3JsZEhlaWdodCA9IHdvcmxkV2lkdGggKiAyO1xuXG5leHBvcnQgbGV0IGRyb3BNYW5pZmVzdCA9IHtcbiAgICBjb2luOiBDb2luLFxuICAgIHBvb3A6IEl0ZW0sXG4gICAgeHA6IFhQRHJvcFxufVxuXG5leHBvcnQgbGV0IGl0ZW1NYW5pZmVzdCA9IHtcbiAgICAncG9vcCc6IHtcbiAgICAgICAgbWF4TGV2ZWw6IDUsXG4gICAgICAgIGRyb3BUYWJsZToge1xuICAgICAgICAgICAgY29pbjogWzMsIDVdLFxuICAgICAgICAgICAgW2Bwb29wLTFgXTogWzEsIDNdLFxuICAgICAgICAgICAgeHA6IFs1MCwgNTBdXG4gICAgICAgIH1cbiAgICB9LFxuICAgICdnb2xkX3Bvb3AnOiB7XG4gICAgICAgIG1heExldmVsOiA1LFxuICAgICAgICBkcm9wVGFibGU6IHtcbiAgICAgICAgICAgIGNvaW46IFszMCwgNTBdLFxuICAgICAgICAgICAgW2Bnb2xkX3Bvb3AtMWBdOiBbMSwgM10sXG4gICAgICAgICAgICB4cDogWzE1MCwgMTUwXVxuICAgICAgICB9XG4gICAgfSxcbn1cblxuZXhwb3J0IGxldCBsZXZlbE1hbmlmZXN0ID0ge1xuICAgIDE6IHtcbiAgICAgICAgcmV3YXJkczoge1xuICAgICAgICAgICAgJ2FudGlmb2cnOiAxMFxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgeHBCb3VuZGFyeUZvckxldmVsID0gbGV2ZWwgPT4ge1xuICAgIHJldHVybiAxMDAgKiBsZXZlbCAqIChsZXZlbCAvIDIpO1xufVxuXG5leHBvcnQgY29uc3QgeHBUb0N1cnJlbnRMZXZlbCA9IHhwID0+IHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnNxcnQoMiAqIHhwIC8gMTAwKSk7XG59XG5cbmV4cG9ydCBjb25zdCByYW5kSW5SYW5nZSA9IChtaW4sIG1heCkgPT4ge1xuICAgIHJldHVybiBNYXRoLmZsb29yKG1pbiArIChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSk7XG59XG5cbmV4cG9ydCBsZXQgY29pbnMgPSAwO1xuZXhwb3J0IGNvbnN0IGFkZENvaW5zID0gbiA9PiB7XG4gICAgY29pbnMgKz0gbjtcbiAgICBzYXZlR2FtZSgpO1xufVxuZXhwb3J0IGxldCB4cCA9IDA7XG5cbmV4cG9ydCBjb25zdCBhZGRYcCA9IG4gPT4ge1xuICAgIGxldCBwcmV2THZsID0geHBUb0N1cnJlbnRMZXZlbCh4cCk7XG4gICAgeHAgKz0gbjtcbiAgICBsZXQgbmV4dEx2bCA9IHhwVG9DdXJyZW50TGV2ZWwoeHApO1xuXG4gICAgaWYgKHByZXZMdmwgPCBuZXh0THZsKSB7XG4gICAgICAgIGxldmVsVXAoKTtcbiAgICB9XG4gICAgc2F2ZUdhbWUoKTtcbn1cblxuZXhwb3J0IGxldCB0b29scyA9IHtcbiAgICBhbnRpZm9nOiBuZXcgQW50aUZvZyxcbiAgICBoYW5kOiBuZXcgSGFuZFRvb2wsXG59XG5cbmV4cG9ydCBsZXQgdG9vbCA9ICdoYW5kJztcblxuZXhwb3J0IGNvbnN0IGNoYW5nZVRvb2wgPSAodG9vbE5hbWUpID0+IHtcbiAgICB0b29sID0gdG9vbE5hbWU7XG59XG5cbmV4cG9ydCBjb25zdCBuZXh0VG9vbCA9ICgpID0+IHtcbiAgICBsZXQgdElEcyA9IE9iamVjdC5rZXlzKHRvb2xzKTtcbiAgICBsZXQgY291bnQgPSB0SURzLmxlbmd0aDtcbiAgICBsZXQgY0lkeCA9IHRJRHMuaW5kZXhPZih0b29sKTtcblxuICAgIGlmIChjSWR4ID49IGNvdW50IC0gMSkge1xuICAgICAgICB0b29sID0gdElEc1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0b29sID0gdElEc1tjSWR4ICsgMV07XG4gICAgfVxufVxuXG5jb25zdCBsZXZlbFVwID0gKCkgPT4ge1xuICAgIGxldCBsdmwgPSB4cFRvQ3VycmVudExldmVsKHhwKTtcblxuICAgIGlmICghbGV2ZWxNYW5pZmVzdFtsdmxdKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Jld2FyZHMgbm90IGltcGxlbWVudGVkIGZvciBsZXZlbCAnICsgbHZsKTtcbiAgICB9XG4gICAgLy8gY3JlYXRlIHJld2FyZCBzY3JlZW5cbiAgICBVSUVsZW1lbnRzLnB1c2gobmV3IExldmVsVXBTY3JlZW4pO1xuICAgIC8vIGNvbnNvbGUubG9nKCdSZXdhcmQgc2NyZWVuIG5vdCBpbXBsZW1lbnRlZCEnLCBsZXZlbE1hbmlmZXN0W2x2bF0pO1xufVxuXG5leHBvcnQgbGV0IGNhbWVyYTogQ2FtZXJhO1xuXG5leHBvcnQgbGV0IHNwcml0ZXM6IHsgW3g6IHN0cmluZ106IFNwcml0ZSB9ID0ge307XG5cbmludGVyZmFjZSBJR3JpZFRpbGUge1xuICAgIHRpbGU6IFRpbGUsXG4gICAgY29udGVudHM6IEl0ZW1cbn1cblxuZXhwb3J0IGxldCB0aWxlR3JpZDogSUdyaWRUaWxlW11bXSA9IFtdO1xuXG5leHBvcnQgbGV0IFVJRWxlbWVudHM6IGFueVtdID0gW107XG5cbmV4cG9ydCBsZXQgYW5pbWFsczogQW5pbWFsW10gPSBbXTtcblxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIGxvYWRlZCgpO1xuXG4gICAgaWYgKERFQlVHLmVkaXRWYXJzKSB7XG4gICAgICAgIGdsb2JhbFRoaXMuYWRkWHAgPSBhZGRYcDtcbiAgICAgICAgZ2xvYmFsVGhpcy54cFRvQ3VycmVudExldmVsID0geHBUb0N1cnJlbnRMZXZlbDtcbiAgICAgICAgZ2xvYmFsVGhpcy5hZGRDaGlja2VuQXRQb3MgPSBwb3MgPT4ge1xuICAgICAgICAgICAgYW5pbWFscy5wdXNoKG5ldyBDaGlja2VuKHBvcykpO1xuICAgICAgICB9XG4gICAgICAgIGdsb2JhbFRoaXMuY2FtZXJhID0gY2FtZXJhO1xuICAgIH1cbn0pXG5cbmNvbnN0IGxvYWRTcHJpdGVzID0gKCkgPT4ge1xuICAgIGxldCBsb2FkUHJvbWlzZXM6IFByb21pc2U8YW55PltdID0gW107XG5cbiAgICBzcHJpdGVzLmdyYXNzID0gbmV3IFNwcml0ZSgnLi9pbWcvdGlsZXMvZ3Jhc3MucG5nJywgNjQsIDk2KTtcbiAgICBsb2FkUHJvbWlzZXMucHVzaChzcHJpdGVzLmdyYXNzLnJlYWR5KTtcblxuICAgIHNwcml0ZXMud2F0ZXIgPSBuZXcgU3ByaXRlKCcuL2ltZy90aWxlcy93YXRlci5wbmcnLCA2NCwgMzIpO1xuICAgIHNwcml0ZXMud2F0ZXIuZnJhbWVSYXRlID0gVElMRV9GUkFNRVJBVEU7XG4gICAgbG9hZFByb21pc2VzLnB1c2goc3ByaXRlcy53YXRlci5yZWFkeSk7XG5cbiAgICBzcHJpdGVzLmZvZyA9IG5ldyBTcHJpdGUoJy4vaW1nL3RpbGVzL2ZvZy5wbmcnLCA2NCwgOTYpO1xuICAgIGxvYWRQcm9taXNlcy5wdXNoKHNwcml0ZXMuZm9nLnJlYWR5KTtcblxuXG4gICAgZm9yIChsZXQgaSBpbiBpdGVtTWFuaWZlc3QpIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPD0gaXRlbU1hbmlmZXN0W2ldLm1heExldmVsOyBqKyspIHtcbiAgICAgICAgICAgIHNwcml0ZXNbYCR7aX0tJHtqfWBdID0gbmV3IFNwcml0ZShgLi9pbWcvaXRlbXMvJHtpfS8ke2l9LSR7an0ucG5nYCk7XG4gICAgICAgICAgICBsb2FkUHJvbWlzZXMucHVzaChzcHJpdGVzW2Ake2l9LSR7an1gXS5yZWFkeSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzcHJpdGVzWydhbmltYWwtY2hpY2tlbiddID0gbmV3IFNwcml0ZSgnLi9pbWcvYW5pbWFscy9jaGlja2VuLnBuZycsIDMyLCAzMik7XG5cbiAgICBzcHJpdGVzLmJhbmsgPSBuZXcgU3ByaXRlKGAuL2ltZy9ncmFwaGljcy9iYW5rLnBuZ2AsIDY0LCA2NCk7XG4gICAgbG9hZFByb21pc2VzLnB1c2goc3ByaXRlcy5iYW5rLnJlYWR5KTtcblxuICAgIHNwcml0ZXMudG9vbF9zZWxlY3QgPSBuZXcgU3ByaXRlKGAuL2ltZy9ncmFwaGljcy90b29sX3NlbGVjdC5wbmdgLCA2NCwgNjQpO1xuICAgIGxvYWRQcm9taXNlcy5wdXNoKHNwcml0ZXMudG9vbF9zZWxlY3QucmVhZHkpO1xuXG4gICAgc3ByaXRlcy5oYW5kID0gbmV3IFNwcml0ZShgLi9pbWcvZ3JhcGhpY3MvaGFuZC5wbmdgLCA2NCwgNjQpO1xuICAgIGxvYWRQcm9taXNlcy5wdXNoKHNwcml0ZXMuaGFuZC5yZWFkeSk7XG5cbiAgICBzcHJpdGVzLmFudGlmb2cgPSBuZXcgU3ByaXRlKGAuL2ltZy9ncmFwaGljcy9hbnRpZm9nLnBuZ2AsIDY0LCA2NCk7XG4gICAgbG9hZFByb21pc2VzLnB1c2goc3ByaXRlcy5hbnRpZm9nLnJlYWR5KTtcblxuICAgIHNwcml0ZXMuaW52ZW50b3J5ID0gbmV3IFNwcml0ZShgLi9pbWcvZ3JhcGhpY3MvaW52ZW50b3J5LnBuZ2AsIDY0LCA2NCk7XG4gICAgbG9hZFByb21pc2VzLnB1c2goc3ByaXRlcy5pbnZlbnRvcnkucmVhZHkpO1xuXG4gICAgc3ByaXRlcy5jb2luID0gbmV3IFNwcml0ZSgnLi9pbWcvaXRlbXMvY29pbi5wbmcnLCAxNiwgMTYpO1xuICAgIHNwcml0ZXMuY29pbi5mcmFtZVJhdGUgPSAyMDtcbiAgICBsb2FkUHJvbWlzZXMucHVzaChzcHJpdGVzLmNvaW4ucmVhZHkpO1xuXG4gICAgc3ByaXRlcy54cCA9IG5ldyBTcHJpdGUoJy4vaW1nL2l0ZW1zL3hwLnBuZycsIDE2LCAxNik7XG4gICAgc3ByaXRlcy54cC5mcmFtZVJhdGUgPSAyMDtcbiAgICBsb2FkUHJvbWlzZXMucHVzaChzcHJpdGVzLnhwLnJlYWR5KTtcblxuICAgIHNwcml0ZXMueHBvcmIgPSBuZXcgU3ByaXRlKCcuL2ltZy9ncmFwaGljcy94cG9yYi5wbmcnLCA2NCwgNjQpO1xuICAgIHNwcml0ZXMueHBvcmIuYW5pbWF0ZSA9ICdzdGVwcGVkJztcbiAgICBsb2FkUHJvbWlzZXMucHVzaChzcHJpdGVzLnhwb3JiLnJlYWR5KTtcblxuICAgIHNwcml0ZXMucGxheUJ1dHRvbiA9IG5ldyBTcHJpdGUoJy4vaW1nL2dyYXBoaWNzL2J0bl9wbGF5LnBuZycsIDE4MiwgMTEyKTtcbiAgICBsb2FkUHJvbWlzZXMucHVzaChzcHJpdGVzLnBsYXlCdXR0b24ucmVhZHkpO1xuXG4gICAgc3ByaXRlcy5tZW51QnV0dG9uID0gbmV3IFNwcml0ZSgnLi9pbWcvZ3JhcGhpY3MvYnRuX21lbnUucG5nJywgOTIsIDYwKTtcbiAgICBsb2FkUHJvbWlzZXMucHVzaChzcHJpdGVzLm1lbnVCdXR0b24ucmVhZHkpO1xuXG4gICAgc3ByaXRlcy5jbGVhckJ1dHRvbiA9IG5ldyBTcHJpdGUoJy4vaW1nL2dyYXBoaWNzL2J0bl9jbGVhci5wbmcnLCA5MiwgNjApO1xuICAgIGxvYWRQcm9taXNlcy5wdXNoKHNwcml0ZXMuY2xlYXJCdXR0b24ucmVhZHkpO1xuXG4gICAgc3ByaXRlcy5jbGVhckJ1dHRvbkluYWN0aXZlID0gbmV3IFNwcml0ZSgnLi9pbWcvZ3JhcGhpY3MvYnRuX2NsZWFyX2luYWN0aXZlLnBuZycsIDkyLCA2MCk7XG4gICAgbG9hZFByb21pc2VzLnB1c2goc3ByaXRlcy5jbGVhckJ1dHRvbkluYWN0aXZlLnJlYWR5KTtcblxuICAgIHNwcml0ZXMudGl0bGUgPSBuZXcgU3ByaXRlKCcuL2ltZy9ncmFwaGljcy90aXRsZS5wbmcnLCAzMjAsIDE4NCk7XG4gICAgbG9hZFByb21pc2VzLnB1c2goc3ByaXRlcy50aXRsZS5yZWFkeSk7XG5cbiAgICBzcHJpdGVzLmNsb3NlID0gbmV3IFNwcml0ZSgnLi9pbWcvZ3JhcGhpY3MvY2xvc2UucG5nJywgMzIsIDMyKTtcbiAgICBsb2FkUHJvbWlzZXMucHVzaChzcHJpdGVzLmNsb3NlLnJlYWR5KTtcblxuICAgIHJldHVybiBQcm9taXNlLmFsbFNldHRsZWQobG9hZFByb21pc2VzKTtcbn1cblxuLy8gYnIyID09PT09PT09PT09PT09PT09PT09PT09PT09IFNBVkVMT0FEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cbmxldCBzYXZpbmc7XG5cbmV4cG9ydCBjb25zdCBzYXZlR2FtZSA9IChmb3JjZT8pID0+IHtcblxuICAgIGNsZWFyVGltZW91dChzYXZpbmcpO1xuXG4gICAgc2F2aW5nID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGxldCBzYXZlRGF0YSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGVHcmlkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzYXZlRGF0YVtpXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aWxlR3JpZFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHNhdmVEYXRhW2ldW2pdID0ge1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50czogdGlsZUdyaWRbaV1bal0uY29udGVudHMgPyB0aWxlR3JpZFtpXVtqXS5jb250ZW50cy50b0pTT04oKSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHRpbGU6IHRpbGVHcmlkW2ldW2pdLnRpbGUudG9KU09OKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZnVsbFN0YXRlID0ge1xuICAgICAgICAgICAgY29pbnM6IGNvaW5zLFxuICAgICAgICAgICAgeHA6IHhwLFxuICAgICAgICAgICAgdGlsZUdyaWQ6IHNhdmVEYXRhLFxuICAgICAgICAgICAgaW52ZW50b3J5OiBpbnZlbnRvcnkudG9KU09OKCksXG4gICAgICAgICAgICBhbmltYWxzOiBhbmltYWxzLFxuICAgICAgICAgICAgdG9vbHM6IHRvb2xzLFxuICAgICAgICAgICAgZXhwYW5kYWJsZVNwYWNlSGVyZTogdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3NhdmUnLCBKU09OLnN0cmluZ2lmeShmdWxsU3RhdGUpKTtcbiAgICAgICAgY29uc29sZS5pbmZvKCdHYW1lIHNhdmVkIScpO1xuICAgIH0sIGZvcmNlID8gMCA6IDEwMDApO1xufVxuXG5cbmNvbnN0IGxvYWRHYW1lID0gKCkgPT4ge1xuICAgIGNsZWFudXBBcnJheXMoKTtcblxuICAgIGxldCBzYXZlRGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NhdmUnKSk7XG5cbiAgICBjb2lucyA9IHNhdmVEYXRhLmNvaW5zO1xuICAgIHhwID0gc2F2ZURhdGEueHA7XG4gICAgaW52ZW50b3J5LmNvbnRlbnRzID0gc2F2ZURhdGEuaW52ZW50b3J5IHx8IHt9O1xuICAgIHRvb2xzLmFudGlmb2cuYWRkVXNlcyhzYXZlRGF0YS50b29scy5hbnRpZm9nLnVzZXMpO1xuXG4gICAgZm9yIChsZXQgYW5pbWFsIG9mIHNhdmVEYXRhLmFuaW1hbHMpIHtcbiAgICAgICAgYW5pbWFscy5wdXNoKG5ld0FuaW1hbEZyb21KU09OKGFuaW1hbCkpXG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzYXZlRGF0YS50aWxlR3JpZC5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aWxlR3JpZFtpXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNhdmVEYXRhLnRpbGVHcmlkW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB0aWxlR3JpZFtpXVtqXSA9IHtcbiAgICAgICAgICAgICAgICBjb250ZW50czogc2F2ZURhdGEudGlsZUdyaWRbaV1bal0uY29udGVudHMgPyBuZXdJdGVtRnJvbUpTT04oc2F2ZURhdGEudGlsZUdyaWRbaV1bal0uY29udGVudHMpIDogbnVsbCxcbiAgICAgICAgICAgICAgICB0aWxlOiBuZXdUaWxlRnJvbUpTT04oc2F2ZURhdGEudGlsZUdyaWRbaV1bal0udGlsZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gYnIzID09PT09PT09PT09PT09PT09PT09PT09PT09IEZMT1cgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IHN0YXJ0TG9vcCA9ICgpID0+IHtcbiAgICBsb29wID0gdHJ1ZTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWFpbkxvb3ApO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3VGlsZXMpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3SXRlbXMpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGVJdGVtcyk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZVRpbGVzKTtcbn1cblxuY29uc3QgYWRkR2FtZVVJID0gKCkgPT4ge1xuICAgIFVJRWxlbWVudHMgPSBbXTtcblxuICAgIFVJRWxlbWVudHMucHVzaChuZXcgQmFuayh7XG4gICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgIGhlaWdodDogNjQsXG4gICAgICAgIHR5cGU6ICdiYW5rJyxcbiAgICAgICAgc3ByaXRlOiBzcHJpdGVzLmJhbmtcbiAgICB9KSlcblxuICAgIFVJRWxlbWVudHMucHVzaChuZXcgVG9vbFNlbGVjdG9yKHtcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdG9wOiBsYXllcnNbMF0uY252LmhlaWdodCAtIDY0LFxuICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgIGhlaWdodDogNjQsXG4gICAgICAgIHR5cGU6ICd0b29sX3NlbGVjdCcsXG4gICAgICAgIHNwcml0ZTogc3ByaXRlcy50b29sX3NlbGVjdFxuICAgIH0pKVxuXG4gICAgVUlFbGVtZW50cy5wdXNoKG5ldyBJbnZlbnRvcnlCdXR0b24oe1xuICAgICAgICBjZW50ZXJYOiB0cnVlLFxuICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgIGhlaWdodDogNjQsXG4gICAgICAgIHR5cGU6ICdpbnZlbnRvcnknLFxuICAgICAgICBzcHJpdGU6IHNwcml0ZXMuaW52ZW50b3J5XG4gICAgfSkpXG5cbiAgICBVSUVsZW1lbnRzLnB1c2gobmV3IENvaW5EaXNwbGF5KHtcbiAgICAgICAgcmlnaHQ6IDY0LFxuICAgICAgICB3aWR0aDogMTIwLFxuICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICB0eXBlOiAnY29pbmRpc3BsYXknLFxuICAgICAgICBzcHJpdGU6IHNwcml0ZXMuY29pblxuICAgIH0pKVxuXG4gICAgVUlFbGVtZW50cy5wdXNoKG5ldyBYUERpc3BsYXkoe1xuICAgICAgICBsZWZ0OiA2NCxcbiAgICAgICAgd2lkdGg6IDEyMCxcbiAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgdHlwZTogJ3hwZGlzcGxheScsXG4gICAgICAgIHNwcml0ZTogc3ByaXRlcy54cFxuICAgIH0pKVxuXG4gICAgVUlFbGVtZW50cy5wdXNoKG5ldyBYUEJhbGwoe1xuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgIGhlaWdodDogNjQsXG4gICAgICAgIHR5cGU6ICd4cG9yYicsXG4gICAgICAgIHNwcml0ZTogc3ByaXRlcy54cG9yYlxuICAgIH0pKVxufVxuXG5leHBvcnQgY29uc3Qgc3RhcnRHYW1lID0gKCkgPT4ge1xuICAgIGNsZWFyTGF5ZXIoJ3VpJyk7XG4gICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzYXZlJykgPT0gbnVsbCkge1xuICAgICAgICBjcmVhdGVOZXdHYW1lKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbG9hZEdhbWUoKTtcbiAgICB9XG5cbiAgICBhZGRHYW1lVUkoKTtcblxuICAgIHN0YXRlID0gJ3BsYXlpbmcnO1xuICAgIC8vQHRzLWlnbm9yZSB5ZXMgdHlwZXNjdGlwdCBJIGNhbiBzZXQgdGhlIGxvY2F0aW9uIGRpcmVjdGx5IGZ1Y2sgb2ZmZmZmZmZmXG4gICAgd2luZG93LmxvY2F0aW9uID0gJyMnICsgc3RhdGU7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsICgpID0+IHtcbiAgICBpZiAoc3RhdGUgPT0gbG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpKSByZXR1cm47XG4gICAgc3RhdGUgPSBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJyk7XG5cbiAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICAgIGNhc2UgJ3BsYXlpbmcnOlxuICAgICAgICAgICAgc3RhcnRHYW1lKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbWFpbm1lbnUnOlxuICAgICAgICAgICAgY3JlYXRlTWFpbk1lbnUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignSGFzaCBub3QgZm91bmQhJywgc3RhdGUpO1xuICAgIH1cbn0pXG5cbmNvbnN0IGNyZWF0ZU1haW5NZW51ID0gKCkgPT4ge1xuICAgIGNsZWFudXBBcnJheXMoKTtcbiAgICBjbGVhckxheWVyKCd1aScpO1xuICAgIHN0YXRlID0gJ21haW5tZW51JztcbiAgICAvL0B0cy1pZ25vcmUgeWVzIHR5cGVzY3RpcHQgSSBjYW4gc2V0IHRoZSBsb2NhdGlvbiBkaXJlY3RseSBmdWNrIG9mZmZmZmZmZlxuICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcjJyArIHN0YXRlO1xuXG4gICAgVUlFbGVtZW50cy5wdXNoKG5ldyBQbGF5QnV0dG9uKHtcbiAgICAgICAgaGVpZ2h0OiA0OCAqIDIsXG4gICAgICAgIHdpZHRoOiA3OCAqIDIsXG4gICAgICAgIGNlbnRlclg6IHRydWUsXG4gICAgICAgIGJvdHRvbTogbGF5ZXJzWzBdLmNudi5oZWlnaHQgKiAwLjA1LFxuICAgICAgICBzcHJpdGU6IHNwcml0ZXMucGxheUJ1dHRvbixcbiAgICAgICAgdHlwZTogJ3BsYXknXG4gICAgfSkpXG5cbiAgICBVSUVsZW1lbnRzLnB1c2gobmV3IE1lbnVCdXR0b24oe1xuICAgICAgICBoZWlnaHQ6IDYwLFxuICAgICAgICB3aWR0aDogOTIsXG4gICAgICAgIHRvcDogMTAsXG4gICAgICAgIHJpZ2h0OiAxMCxcbiAgICAgICAgc3ByaXRlOiBzcHJpdGVzLm1lbnVCdXR0b24sXG4gICAgICAgIHR5cGU6ICdtZW51J1xuICAgIH0pKVxuXG4gICAgVUlFbGVtZW50cy5wdXNoKG5ldyBVSUVsZW1lbnQoe1xuICAgICAgICBoZWlnaHQ6IDkyICogMixcbiAgICAgICAgd2lkdGg6IDE2MCAqIDIsXG4gICAgICAgIGNlbnRlclg6IHRydWUsXG4gICAgICAgIHRvcDogbGF5ZXJzWzBdLmNudi5oZWlnaHQgKiAwLjA1LFxuICAgICAgICBzcHJpdGU6IHNwcml0ZXMudGl0bGUsXG4gICAgICAgIHR5cGU6ICd0aXRsZSdcbiAgICB9KSlcbn1cblxuY29uc3QgbG9hZGVkID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnRlbnREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpO1xuXG4gICAgbGV0IGNCQiA9IGNvbnRlbnREaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICBsZXQgY0JCU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGNvbnRlbnREaXYpO1xuXG4gICAgbGV0IGdhbWVXID0gY0JCLndpZHRoIC0gTnVtYmVyKGNCQlN0eWxlLmJvcmRlcldpZHRoLnJlcGxhY2UoJ3B4JywgJycpKSAqIDIgLSBOdW1iZXIoY0JCU3R5bGUucGFkZGluZ0xlZnQucmVwbGFjZSgncHgnLCAnJykpIC0gTnVtYmVyKGNCQlN0eWxlLnBhZGRpbmdSaWdodC5yZXBsYWNlKCdweCcsICcnKSlcbiAgICBsZXQgZ2FtZUggPSBjQkIuaGVpZ2h0IC0gTnVtYmVyKGNCQlN0eWxlLmJvcmRlcldpZHRoLnJlcGxhY2UoJ3B4JywgJycpKSAqIDIgLSBOdW1iZXIoY0JCU3R5bGUucGFkZGluZ1RvcC5yZXBsYWNlKCdweCcsICcnKSkgLSBOdW1iZXIoY0JCU3R5bGUucGFkZGluZ0JvdHRvbS5yZXBsYWNlKCdweCcsICcnKSlcblxuICAgIGZvciAobGV0IGMgb2YgbGF5ZXJzKSB7XG4gICAgICAgIGMuY252LndpZHRoID0gZ2FtZVc7XG4gICAgICAgIGMuY252LmhlaWdodCA9IGdhbWVIO1xuICAgIH1cblxuICAgIGNhbWVyYSA9IG5ldyBDYW1lcmE7XG5cbiAgICBmb3IgKGxldCBjIG9mIGxheWVycykge1xuICAgICAgICBjb250ZW50RGl2LmFwcGVuZENoaWxkKGMuY252KTtcbiAgICB9XG5cbiAgICBhd2FpdCBsb2FkU3ByaXRlcygpO1xuICAgIC8vIHN0YXJ0IG1ha2luZyB0aWxlcyBoZXJlXG5cbiAgICAvLyBpbml0aWFsaXplIGFycmF5XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3b3JsZFdpZHRoOyBpKyspIHtcbiAgICAgICAgdGlsZUdyaWRbaV0gPSBbXTtcbiAgICB9XG5cbiAgICBjb250ZW50RGl2LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0b3VjaGVkKTtcblxuICAgIGNyZWF0ZU1haW5NZW51KCk7XG5cbiAgICBzdGFydExvb3AoKTtcbn1cblxuY29uc3QgY2xlYW51cEFycmF5cyA9ICgpID0+IHtcbiAgICBjb2lucyA9IDA7XG4gICAgeHAgPSAwO1xuICAgIGludmVudG9yeSA9IG5ldyBJbnZlbnRvcnk7XG4gICAgYW5pbWFscyA9IFtdO1xuICAgIHRvb2xzID0ge1xuICAgICAgICBhbnRpZm9nOiBuZXcgQW50aUZvZyxcbiAgICAgICAgaGFuZDogbmV3IEhhbmRUb29sLFxuICAgIH07XG4gICAgVUlFbGVtZW50cyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3b3JsZFdpZHRoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB3b3JsZEhlaWdodDsgaisrKSB7XG4gICAgICAgICAgICB0aWxlR3JpZFtpXVtqXSA9IHtcbiAgICAgICAgICAgICAgICBjb250ZW50czogbnVsbCxcbiAgICAgICAgICAgICAgICB0aWxlOiBuZXcgVGlsZSh7XG4gICAgICAgICAgICAgICAgICAgIGdyaWRQb3NpdGlvbjogeyBncmlkWDogaSwgZ3JpZFk6IGogfSxcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlOiBzcHJpdGVzLndhdGVyLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnd2F0ZXInXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4vLyBuZXcgZ2FtZVxuY29uc3QgY3JlYXRlTmV3R2FtZSA9ICgpID0+IHtcbiAgICBjbGVhbnVwQXJyYXlzKCk7XG5cbiAgICBsZXQgd2F0ZXJIQm9yZGVyID0gMTtcbiAgICBsZXQgd2F0ZXJWQm9yZGVyID0gNjtcblxuICAgIGxldCBzZWVkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTIzNDU2Nyk7XG5cbiAgICBjb25zdCBub2lzZUdlbiA9IG1ha2VOb2lzZTNEKHNlZWQpO1xuXG4gICAgZm9yIChsZXQgaSA9IHdhdGVySEJvcmRlcjsgaSA8IHdvcmxkV2lkdGggLSB3YXRlckhCb3JkZXI7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gd2F0ZXJWQm9yZGVyOyBqIDwgd29ybGRIZWlnaHQgLSB3YXRlclZCb3JkZXI7IGorKykge1xuICAgICAgICAgICAgY29uc3Qgbm9pc2VTY2FsZSA9IDIwO1xuXG4gICAgICAgICAgICBsZXQgaXRlbVNpemUgPSA1Oy8vTWF0aC5mbG9vcigxICsgTWF0aC5yYW5kb20oKSAqIDUpO1xuXG4gICAgICAgICAgICBsZXQgaXRlbSA9IE1hdGgucmFuZG9tKCkgPiAwLjUgPyAncG9vcCcgOiAnZ29sZF9wb29wJztcblxuICAgICAgICAgICAgaWYgKG5vaXNlR2VuKGkgLyBub2lzZVNjYWxlLCBqIC8gbm9pc2VTY2FsZSwgMTAwKSA+IDApIHtcbiAgICAgICAgICAgICAgICBsZXQgdGlsZTtcblxuICAgICAgICAgICAgICAgIGlmIChpIDwgd29ybGRXaWR0aCAvIDIgJiYgaiA8IHdvcmxkSGVpZ2h0IC8gMikge1xuICAgICAgICAgICAgICAgICAgICB0aWxlID0gbmV3IFRpbGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZFBvc2l0aW9uOiB7IGdyaWRYOiBpLCBncmlkWTogaiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ByaXRlOiBzcHJpdGVzLmdyYXNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcHBhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dyYXNzJyxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aWxlID0gbmV3IFRpbGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZFBvc2l0aW9uOiB7IGdyaWRYOiBpLCBncmlkWTogaiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ByaXRlOiBzcHJpdGVzLmZvZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3BwYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZm9nJyxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGlsZUdyaWRbaV1bal0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpbGUsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzOiBNYXRoLnJhbmRvbSgpIDwgMC4xID8gbmV3IEl0ZW0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZFBvc2l0aW9uOiB7IGdyaWRYOiBpLCBncmlkWTogaiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ByaXRlOiBzcHJpdGVzW2Ake2l0ZW19LSR7aXRlbVNpemV9YF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBpdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV2ZWw6IGl0ZW1TaXplXG4gICAgICAgICAgICAgICAgICAgIH0pIDogbnVsbCxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzYXZlR2FtZSh0cnVlKTtcbn1cblxuLy8gYnI0ID09PT09PT09PT09PT09PT09IERSQVdJTkcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxubGV0IGZwcyA9IDA7XG5sZXQgbGFzdFQgPSAwO1xubGV0IGZyYW1lVGltZSA9IDA7XG5leHBvcnQgbGV0IGZFbGFwc2VkVGltZSA9IDA7XG5cbmV4cG9ydCBsZXQgZnJhbWVDb3VudCA9IDA7XG5cbmxldCBwcmV2RlBTcyA9IFtdO1xuXG5sZXQgYXZnRnBzO1xuXG5jb25zdCBhdmcgPSAoYXJyKSA9PiB7XG4gICAgbGV0IHJ0ID0gMDtcbiAgICBmb3IgKGxldCBhIG9mIGFycikge1xuICAgICAgICBydCArPSBhO1xuICAgIH1cblxuICAgIHJldHVybiBydCAvIGFyci5sZW5ndGg7XG59XG5cbmxldCBkcmF3bk9ianMgPSAwO1xuXG5leHBvcnQgY29uc3QgY2xlYXJMYXllciA9IGwgPT4ge1xuICAgIGlmICh0eXBlb2YgbCA9PSAnc3RyaW5nJykgbCA9IExBWUVSTlVNQkVSU1tsXTtcbiAgICBsYXllcnNbbF0uY3R4LmNsZWFyUmVjdCgwLCAwLCBsYXllcnNbbF0uY252LndpZHRoLCBsYXllcnNbbF0uY252LmhlaWdodCk7XG59XG5cbmNvbnN0IGRyYXdUaWxlcyA9ICgpID0+IHtcbiAgICBpZiAoY2FtZXJhLm1vdmVkIHx8IGZyYW1lQ291bnQgJSBNYXRoLmZsb29yKDYwIC8gVElMRV9GUkFNRVJBVEUpID09IDApIHtcbiAgICAgICAgY2FtZXJhLmRyYXdPYmplY3RzKHRpbGVHcmlkLmZsYXQoKS5maWx0ZXIodCA9PiB0LnRpbGUudmlzaWJsZSkuc29ydCgoYSwgYikgPT4gKGEudGlsZS55IC0gYi50aWxlLnkpKS5tYXAoZ3QgPT4gZ3QudGlsZSkpO1xuICAgICAgICBjYW1lcmEubW92ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGxvb3ApIHJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3VGlsZXMpO1xufVxuXG5jb25zdCB1cGRhdGVUaWxlcyA9ICgpID0+IHtcbiAgICB0aWxlR3JpZC5mb3JFYWNoKGNvbCA9PiBjb2wuZm9yRWFjaChpID0+IGkudGlsZS51cGRhdGUoKSkpO1xuICAgIGlmIChsb29wKSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlVGlsZXMpO1xufVxuXG5jb25zdCBkcmF3SXRlbXMgPSAoKSA9PiB7XG4gICAgY2xlYXJMYXllcignaXRlbScpO1xuICAgIGNhbWVyYS5kcmF3T2JqZWN0cyh0aWxlR3JpZC5mbGF0KCkuZmlsdGVyKHQgPT4gdC5jb250ZW50cz8udmlzaWJsZSkuc29ydCgoYSwgYikgPT4gKGEuY29udGVudHMueSAtIGIuY29udGVudHMueSkpLm1hcChndCA9PiBndC5jb250ZW50cykpO1xuICAgIGNhbWVyYS5kcmF3T2JqZWN0cyhleHRyYUFjdG9ycyk7XG4gICAgaWYgKGxvb3ApIHJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3SXRlbXMpO1xufVxuXG5jb25zdCB1cGRhdGVJdGVtcyA9ICgpID0+IHtcbiAgICB0aWxlR3JpZC5mb3JFYWNoKGNvbCA9PiBjb2wuZmlsdGVyKHQgPT4gdC5jb250ZW50cykuZm9yRWFjaChpID0+IGkuY29udGVudHMudXBkYXRlKCkpKTtcbiAgICBleHRyYUFjdG9ycy5mb3JFYWNoKGEgPT4geyBpZiAoYS5yZW1vdmVOZXh0RHJhdykgYS5kZXN0cm95KCkgfSk7XG4gICAgZXh0cmFBY3RvcnMuZm9yRWFjaChpID0+IGkudXBkYXRlKCkpO1xuICAgIGlmIChsb29wKSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlSXRlbXMpO1xufVxuXG5jb25zdCBkcmF3VUkgPSAoKSA9PiB7XG5cbiAgICBkcmF3bk9ianMgPSAwO1xuICAgIC8vIFVJXG4gICAgVUlFbGVtZW50cy5mb3JFYWNoKGVsID0+IHsgaWYgKGVsLnJlbW92ZU5leHREcmF3KSBlbC5kZXN0cm95KCkgfSk7XG5cbiAgICBmb3IgKGxldCBlbCBvZiBVSUVsZW1lbnRzLnNvcnQoKGEsIGIpID0+IGEueiAtIGIueikpIHtcbiAgICAgICAgZWwuY2xlYXIoKTtcbiAgICAgICAgZWwuZHJhdygpO1xuICAgIH1cblxuICAgIC8vIGlmIChmcmFtZUNvdW50ICUgMTAwID09IDApIGNvbnNvbGUubG9nKGZsYXRBcnJheS5sZW5ndGgsIFVJRWxlbWVudHMubGVuZ3RoLCBkcmF3bk9ianMgKyBVSUVsZW1lbnRzLmxlbmd0aClcbn1cblxuY29uc3QgZHJhd0RlYnVnID0gKCkgPT4ge1xuICAgIGZwcyA9IDEwMDAgLyBmcmFtZVRpbWU7XG4gICAgcHJldkZQU3MucHVzaChmcHMpO1xuXG4gICAgaWYgKHByZXZGUFNzLmxlbmd0aCA+IDMwKSBwcmV2RlBTcy5zaGlmdCgpO1xuXG4gICAgYXZnRnBzID0gYXZnKHByZXZGUFNzKTtcblxuICAgIGxldCBjdHggPSBsYXllcnNbTEFZRVJOVU1CRVJTLmRlYnVnXS5jdHg7XG4gICAgLy9ERUJVR1xuICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgwLDAsMCwwLjMpJztcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgwLDAsMCwwLjMpJztcbiAgICBjdHguY2xlYXJSZWN0KDAsIGxheWVyc1swXS5jbnYuaGVpZ2h0IC0gMjAsIGxheWVyc1swXS5jbnYud2lkdGgsIDIwKTtcbiAgICBjdHguZmlsbFJlY3QoMCwgbGF5ZXJzWzBdLmNudi5oZWlnaHQgLSAyMCwgbGF5ZXJzWzBdLmNudi53aWR0aCwgMjApO1xuICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuICAgIGN0eC5mb250ID0gJzE2cHggbW9ub3NwYWNlJztcbiAgICBjdHguZmlsbFRleHQoJ0ZQUzogJyArIGF2Z0Zwcy50b0ZpeGVkKDIpLCAxMCwgbGF5ZXJzWzBdLmNudi5oZWlnaHQgLSA0KTtcbiAgICBjdHguZmlsbFRleHQoJ3JldicgKyB2ZXJzaW9uLCBsYXllcnNbMF0uY252LndpZHRoIC0gMTIwLCBsYXllcnNbMF0uY252LmhlaWdodCAtIDQpO1xuICAgIGN0eC5maWxsVGV4dChgWyR7KChjYW1lcmEueCArIGNhbWVyYS52aWV3V2lkdGggLyAyKSAtIDMyKS50b1ByZWNpc2lvbig0KX0sJHsoKGNhbWVyYS55ICsgY2FtZXJhLnZpZXdIZWlnaHQgLyAyKSAtIDQ4KS50b1ByZWNpc2lvbig0KX1dYCwgbGF5ZXJzWzBdLmNudi53aWR0aCAvIDIsIGxheWVyc1swXS5jbnYuaGVpZ2h0IC0gNCk7XG4gICAgY3R4LmZpbGxUZXh0KGB7JHtkcmF3bk9ianN9OiR7VUlFbGVtZW50cy5sZW5ndGh9fWAsIDEyOCwgbGF5ZXJzWzBdLmNudi5oZWlnaHQgLSA0KTtcbiAgICBjdHguZmlsbFRleHQoYFRvdWNoc2NyZWVuIE9ubHlgLCAzMDAsIGxheWVyc1swXS5jbnYuaGVpZ2h0IC0gNCk7XG4gICAgLy8gQ3Jvc3NoYWlyXG4gICAgLy8gY3R4LmJlZ2luUGF0aCgpO1xuICAgIC8vIGN0eC5tb3ZlVG8obGF5ZXJzWzBdLmNudi53aWR0aCAvIDIsIDApO1xuICAgIC8vIGN0eC5saW5lVG8obGF5ZXJzWzBdLmNudi53aWR0aCAvIDIsIGxheWVyc1swXS5jbnYuaGVpZ2h0IC0gMjApO1xuICAgIC8vIGN0eC5tb3ZlVG8oMCwgbGF5ZXJzWzBdLmNudi5oZWlnaHQgLyAyKTtcbiAgICAvLyBjdHgubGluZVRvKGxheWVyc1swXS5jbnYud2lkdGgsIGxheWVyc1swXS5jbnYuaGVpZ2h0IC8gMik7XG4gICAgLy8gY3R4LnN0cm9rZSgpO1xuICAgIC8vIGN0eC5jbG9zZVBhdGgoKTtcbn1cblxuY29uc3QgbWFpbkxvb3AgPSAodDogRE9NSGlnaFJlc1RpbWVTdGFtcCkgPT4ge1xuICAgIGZyYW1lVGltZSA9IHQgLSBsYXN0VDtcbiAgICBsYXN0VCA9IHQ7XG4gICAgZkVsYXBzZWRUaW1lID0gZnJhbWVUaW1lIC8gMTAwO1xuXG4gICAgZm9yIChsZXQgcyBpbiBzcHJpdGVzKSB7XG4gICAgICAgIHNwcml0ZXNbc10uZHJhdygpO1xuICAgIH1cblxuICAgIGRyYXdVSSgpO1xuXG4gICAgaGFuZGxlSW5wdXQoKTtcblxuICAgIGlmIChERUJVRy5zaG93SW5mbykge1xuICAgICAgICBkcmF3RGVidWcoKTtcbiAgICB9XG5cbiAgICBmcmFtZUNvdW50Kys7XG5cbiAgICBpZiAobG9vcCkge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWFpbkxvb3ApO1xuICAgIH1cbn1cblxuLy8gYnI1ID09PT09PT09PT09PT09PT09IElOUFVUID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmxldCBrZXlzSGVsZDogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xuICAgIGtleXNIZWxkW2Uua2V5LnRvTG93ZXJDYXNlKCldID0gdHJ1ZTtcblxuICAgIGlmIChlLmtleSA9PSAnbicpIHtcbiAgICAgICAgY3JlYXRlTmV3R2FtZSgpO1xuICAgIH1cbn0pXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZSA9PiB7XG4gICAga2V5c0hlbGRbZS5rZXkudG9Mb3dlckNhc2UoKV0gPSBmYWxzZTtcbn0pXG5cbi8vIGRvIHRoaXMgaW4tY2xhc3M/XG5jb25zdCBoYW5kbGVJbnB1dCA9ICgpID0+IHtcbiAgICBsZXQgbW92ZVNwZWVkID0gNzAgKiBmRWxhcHNlZFRpbWU7XG4gICAgaWYgKGtleXNIZWxkWydzaGlmdCddKSBtb3ZlU3BlZWQgPSAxNDAgKiBmRWxhcHNlZFRpbWU7XG4gICAgaWYgKGtleXNIZWxkWyd3J10pIHtcbiAgICAgICAgY2FtZXJhLm1vdmUoMCwgLW1vdmVTcGVlZCk7XG4gICAgfSBlbHNlIGlmIChrZXlzSGVsZFsncyddKSB7XG4gICAgICAgIGNhbWVyYS5tb3ZlKDAsIG1vdmVTcGVlZCk7XG4gICAgfVxuICAgIGlmIChrZXlzSGVsZFsnYSddKSB7XG4gICAgICAgIGNhbWVyYS5tb3ZlKC1tb3ZlU3BlZWQsIDApO1xuICAgIH0gZWxzZSBpZiAoa2V5c0hlbGRbJ2QnXSkge1xuICAgICAgICBjYW1lcmEubW92ZShtb3ZlU3BlZWQsIDApO1xuICAgIH1cbiAgICBpZiAoa2V5c0hlbGRbJysnXSB8fCBrZXlzSGVsZFsnPSddKSB7XG4gICAgICAgIGNhbWVyYS5zY2FsZSArPSAwLjAxO1xuICAgICAgICBjYW1lcmEubW92ZWQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoa2V5c0hlbGRbJy0nXSkge1xuICAgICAgICBjYW1lcmEuc2NhbGUgLT0gMC4wMTtcbiAgICAgICAgY2FtZXJhLm1vdmVkID0gdHJ1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBwaWNrdXAgPSAoZHJhZ2dlZCwgY2FsbGJhY2s/KSA9PiB7XG4gICAgLy8gaXRlbSBkcmFnZ2luZyBsaXN0ZW5lcnNcbiAgICBsZXQgeCA9IDA7XG4gICAgbGV0IHkgPSAwO1xuXG4gICAgZXh0cmFBY3RvcnMucHVzaChkcmFnZ2VkKTtcblxuICAgIGNvbnN0IG1vdmVIYW5kbGVyID0gZSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjYW1lcmEubW92ZWQgPSB0cnVlOyAvLyBmb3JjZSB0aWxlIHJlZHJhd1xuXG4gICAgICAgIGlmIChkcmFnZ2VkLmdyaWRYICE9IC0xICYmIGRyYWdnZWQuZ3JpZFkgIT0gLTEpIHRpbGVHcmlkW2RyYWdnZWQuZ3JpZFhdW2RyYWdnZWQuZ3JpZFldLmNvbnRlbnRzID0gbnVsbDtcblxuICAgICAgICB4ID0gZS50b3VjaGVzWzBdLnBhZ2VYIC0gdGFyZ2V0QkIueCArIGNhbWVyYS54O1xuICAgICAgICB5ID0gZS50b3VjaGVzWzBdLnBhZ2VZIC0gdGFyZ2V0QkIueSArIGNhbWVyYS55O1xuXG4gICAgICAgIGlmICh4ID4gbGF5ZXJzWzBdLmNudi53aWR0aCAqIDAuOSArIGNhbWVyYS54KSBjYW1lcmEubW92ZSg1LCAwKTtcbiAgICAgICAgaWYgKHggPCBsYXllcnNbMF0uY252LndpZHRoICogMC4xICsgY2FtZXJhLngpIGNhbWVyYS5tb3ZlKC01LCAwKTtcbiAgICAgICAgaWYgKHkgPiBsYXllcnNbMF0uY252LmhlaWdodCAqIDAuOSArIGNhbWVyYS55KSBjYW1lcmEubW92ZSgwLCA1KTtcbiAgICAgICAgaWYgKHkgPCBsYXllcnNbMF0uY252LmhlaWdodCAqIDAuMSArIGNhbWVyYS55KSBjYW1lcmEubW92ZSgwLCAtNSk7XG5cbiAgICAgICAgZHJhZ2dlZC5feCA9ICh4ICogMSAvIGNhbWVyYS5zY2FsZSkgLSBkcmFnZ2VkLndpZHRoIC8gMiAqIGNhbWVyYS5zY2FsZTtcbiAgICAgICAgZHJhZ2dlZC5feSA9ICh5ICogMSAvIGNhbWVyYS5zY2FsZSkgLSBkcmFnZ2VkLndpZHRoIC8gMiAqIGNhbWVyYS5zY2FsZTtcblxuICAgICAgICBmb3IgKGxldCBndGlsZSBvZiB0aWxlR3JpZC5mbGF0KCkpIHtcbiAgICAgICAgICAgIGxldCB0aWxlID0gZ3RpbGUudGlsZTtcbiAgICAgICAgICAgIGlmICghdGlsZS5kcm9wcGFibGUpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICB0aWxlLmRyYWdnZWRPdmVyID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmICh0aWxlLmNvbGxpZGVzKHgsIHkpKSB7XG4gICAgICAgICAgICAgICAgdGlsZS5kcmFnZ2VkT3ZlciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgZW5kSGFuZGxlciA9IGUgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxldCBnb29kTW92ZSA9IGZhbHNlO1xuXG4gICAgICAgIGNhbWVyYS5tb3ZlZCA9IHRydWU7IC8vIGZvcmNlIHRpbGUgcmVkcmF3XG5cbiAgICAgICAgZm9yIChsZXQgZ3RpbGUgb2YgdGlsZUdyaWQuZmxhdCgpKSB7XG4gICAgICAgICAgICBsZXQgdGlsZSA9IGd0aWxlLnRpbGU7XG4gICAgICAgICAgICBpZiAoIXRpbGUuZHJvcHBhYmxlKSBjb250aW51ZTtcblxuICAgICAgICAgICAgdGlsZS5kcmFnZ2VkT3ZlciA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAodGlsZS5jb2xsaWRlcyh4LCB5KSkge1xuICAgICAgICAgICAgICAgIGlmICh0aWxlLmNvbnRlbnRzICYmICh0aWxlLmNvbnRlbnRzLnR5cGUgIT09IGRyYWdnZWQudHlwZSB8fCB0aWxlLmNvbnRlbnRzLmxldmVsICE9PSBkcmFnZ2VkLmxldmVsKSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBtb3ZlSXRlbSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGlsZUdyaWRbdGlsZS5ncmlkWF1bdGlsZS5ncmlkWV0uY29udGVudHMgPSBkcmFnZ2VkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHNldCBkcmFnZ2VkIHBvc2l0aW9uIHRvIGRyb3BwZWQgZ3JpZFxuICAgICAgICAgICAgICAgICAgICBkcmFnZ2VkLmdyaWRYID0gdGlsZS5ncmlkWDtcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dlZC5ncmlkWSA9IHRpbGUuZ3JpZFk7XG5cbiAgICAgICAgICAgICAgICAgICAgZ29vZE1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aWxlLmNvbnRlbnRzICYmIHRpbGUuY29udGVudHMudHlwZSA9PSBkcmFnZ2VkLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRpbGUuY29udGVudHMubGV2ZWwgPT0gZHJhZ2dlZC5sZXZlbCAmJiBkcmFnZ2VkLm1lcmdlKHRpbGUuY29udGVudHMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnb29kTW92ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtb3ZlSXRlbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGRyYWdnZWQuX3ggPSBmYWxzZTtcbiAgICAgICAgZHJhZ2dlZC5feSA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnRlbnREaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgbW92ZUhhbmRsZXIpO1xuICAgICAgICBjb250ZW50RGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZW5kSGFuZGxlcik7XG4gICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soZmFsc2UpO1xuXG4gICAgICAgIGV4dHJhQWN0b3JzLnNwbGljZShleHRyYUFjdG9ycy5pbmRleE9mKGRyYWdnZWQpLCAxKTtcblxuICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKGdvb2RNb3ZlKTtcblxuICAgICAgICBpZiAoIWdvb2RNb3ZlKSB7XG4gICAgICAgICAgICBpZiAoZHJhZ2dlZC5ncmlkWCAhPSAtMSAmJiBkcmFnZ2VkLmdyaWRZICE9IC0xKSB0aWxlR3JpZFtkcmFnZ2VkLmdyaWRYXVtkcmFnZ2VkLmdyaWRZXS5jb250ZW50cyA9IGRyYWdnZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlR2FtZSgpO1xuICAgIH1cblxuICAgIGNvbnRlbnREaXYuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgbW92ZUhhbmRsZXIpO1xuICAgIGNvbnRlbnREaXYuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBlbmRIYW5kbGVyKTtcblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgY29uc3QgaXRlbVRvdWNoTGlzdGVuZXJzID0gKHgsIHkpID0+IHtcbiAgICBmb3IgKGxldCBndGlsZSBvZiB0aWxlR3JpZC5mbGF0KCkpIHtcbiAgICAgICAgbGV0IGFjdG9yID0gZ3RpbGUuY29udGVudHM7XG5cbiAgICAgICAgaWYgKGFjdG9yICYmIGFjdG9yLmRyYWdnYWJsZSAmJiBhY3Rvci5jb2xsaWRlcyh4LCB5KSkge1xuICAgICAgICAgICAgcGlja3VwKGFjdG9yKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5sZXQgY2FtZXJhVG91Y2hMaXN0ZW5lcnMgPSAoeCwgeSwgdGFyZ2V0QkIsIHN0YXJ0WCwgc3RhcnRZKSA9PiB7XG4gICAgLy8gY2FtZXJhIG1vdmUgbGlzdGVuZXJzXG4gICAgY29uc3QgY2FtZXJhTW92ZUhhbmRsZXIgPSBlID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHggPSBlLnRvdWNoZXNbMF0ucGFnZVggLSB0YXJnZXRCQi54ICsgY2FtZXJhLng7XG4gICAgICAgIHkgPSBlLnRvdWNoZXNbMF0ucGFnZVkgLSB0YXJnZXRCQi55ICsgY2FtZXJhLnk7XG5cbiAgICAgICAgY2FtZXJhLm1vdmUoc3RhcnRYIC0geCwgc3RhcnRZIC0geSk7XG5cbiAgICB9XG5cbiAgICBjb25zdCBjYW1lcmFFbmRIYW5kbGVyID0gZSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjb250ZW50RGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGNhbWVyYU1vdmVIYW5kbGVyKTtcbiAgICAgICAgY29udGVudERpdi5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGNhbWVyYUVuZEhhbmRsZXIpO1xuICAgIH1cblxuICAgIGNvbnRlbnREaXYuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgY2FtZXJhTW92ZUhhbmRsZXIpO1xuICAgIGNvbnRlbnREaXYuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBjYW1lcmFFbmRIYW5kbGVyKTtcbn1cblxuY29uc3QgdWlUb3VjaExpc3RlbmVycyA9ICh4LCB5KSA9PiB7XG4gICAgZm9yIChsZXQgZWwgb2YgVUlFbGVtZW50cy5zb3J0KChhLCBiKSA9PiBiLnggLSBhLngpKSB7XG4gICAgICAgIGlmIChlbC5jb2xsaWRlUG9pbnQoeCwgeSkpIHtcbiAgICAgICAgICAgIGlmICghZWwuaW50ZXJhY3RhYmxlKSByZXR1cm4gdHJ1ZTsgLy8gZWF0IGlucHV0XG4gICAgICAgICAgICBlbC5hY3QoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGNvbnN0IGFuaW1hbFRvdWNoTGlzdGVuZXJzID0gKHgsIHkpID0+IHtcbiAgICBjb25zb2xlLmxvZygnQW5pbWFsIHRvdWNoIGxpc3RlbmVycyBub3QgaW1wbGVtZW50ZWQhJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5sZXQgdGFyZ2V0QkIgPSBsYXllcnNbMF0uY252LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG5jb25zdCB0b3VjaGVkID0gZSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgbGV0IHN0YXJ0WCA9IGUudG91Y2hlc1swXS5wYWdlWCAtIHRhcmdldEJCLnggKyBjYW1lcmEueDtcbiAgICBsZXQgc3RhcnRZID0gZS50b3VjaGVzWzBdLnBhZ2VZIC0gdGFyZ2V0QkIueSArIGNhbWVyYS55O1xuXG4gICAgbGV0IHggPSBzdGFydFg7XG4gICAgbGV0IHkgPSBzdGFydFk7XG5cbiAgICBpZiAodWlUb3VjaExpc3RlbmVycyhlLnRvdWNoZXNbMF0ucGFnZVggLSB0YXJnZXRCQi54LCBlLnRvdWNoZXNbMF0ucGFnZVkgLSB0YXJnZXRCQi55KSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlID09ICdwbGF5aW5nJykge1xuICAgICAgICBpZiAodG9vbHNbdG9vbF0uYWN0KHgsIHkpKSByZXR1cm47XG4gICAgICAgIGNhbWVyYVRvdWNoTGlzdGVuZXJzKHgsIHksIHRhcmdldEJCLCBzdGFydFgsIHN0YXJ0WSk7XG4gICAgfVxufSJdfQ==
