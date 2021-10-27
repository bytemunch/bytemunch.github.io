import { fadeBoxesOut, retractLines } from './animations.js';
import { pages } from '../main.js';
export async function openPage(page) {
    const pg = pages[page.replace('#', '')];
    if (page !== 'blog') {
        let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + location.hash;
        window.history.pushState({ path: newurl }, '', newurl);
    }
    await retractLines();
    await fadeBoxesOut();
    pg.render();
    return;
}
//# sourceMappingURL=openPage.js.map