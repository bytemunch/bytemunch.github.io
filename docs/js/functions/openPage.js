import { fadeBoxesOut, retractLines } from './animations.js';
import { pages } from '../main.js';
export async function openPage(page) {
    const pg = pages[page.replace('#', '')];
    await retractLines();
    await fadeBoxesOut();
    pg.render();
    return;
}
//# sourceMappingURL=openPage.js.map