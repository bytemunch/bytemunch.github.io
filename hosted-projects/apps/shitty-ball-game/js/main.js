import { BallGame } from './class/BallGame.js';
import { ResizeHandler } from './class/ResizeHandler.js';
export let rh = new ResizeHandler;
export const rs = n => n * rh.sizeRatio;
export const rs2 = n => n / rh.sizeRatio;
export const bg = n => n * 30 + 10;
export const nc = (n) => {
    if (typeof n == "number")
        n = BigInt(n);
    if (n < 1000n) {
        return `${n}`;
    }
    if (n < 1000000n) {
        return `${(n / 1000n)}k`;
    }
    if (n < 1000000000n) {
        return `${(n / 1000000n)}m`;
    }
    if (n < 1000000000000n) {
        return `${(n / 1000000000n)}b`;
    }
    if (n < 1000000000000000n) {
        return `${(n / 1000000000000n)}t`;
    }
    if (n < 1000000000000000000n) {
        return `${(n / 1000000000000000n)}q`;
    }
    if (n < 1000000000000000000000n) {
        return `${(n / 1000000000000000000n)}x`;
    }
};
export const nc2 = (n) => {
    if (typeof n == "number")
        n = BigInt(n);
    if (n < 100000n) {
        return `${n}`;
    }
    if (n < 100000000n) {
        return `${(n / 1000n)}k`;
    }
    if (n < 100000000000n) {
        return `${(n / 1000000n)}m`;
    }
    if (n < 100000000000000n) {
        return `${(n / 1000000000n)}b`;
    }
    if (n < 100000000000000000n) {
        return `${(n / 1000000000000n)}t`;
    }
    if (n < 100000000000000000000n) {
        return `${(n / 1000000000000000n)}q`;
    }
    if (n < 100000000000000000000000n) {
        return `${(n / 1000000000000000000n)}x`;
    }
};
export let game;
document.addEventListener('DOMContentLoaded', () => {
    console.log('bollocks');
    game = new BallGame;
    game.postInit();
    console.log(game);
});
//# sourceMappingURL=main.js.map