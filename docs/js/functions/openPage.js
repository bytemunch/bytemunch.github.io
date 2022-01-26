import { fadeOut, retractLines } from './animations.js';
import { pages } from '../main.js';
import { getAnimatableBoxes } from './getAnimatableBoxes.js';
import { wait } from './wait.js';
export async function openPage(page) {
    page = page.split('&')[0];
    const pg = pages[page.replace('#', '')];
    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + location.hash;
    window.history.pushState({ path: newurl }, '', newurl);
    await retractLines();
    const elements = getAnimatableBoxes();
    await fadeOut(elements, 0.05);
    await wait(50);
    for (let el of elements) {
        el.parentElement.tagName == 'A' ? el.parentElement.parentElement.removeChild(el.parentElement) : el.parentElement.removeChild(el);
    }
    pg.render();
    return;
}
//# sourceMappingURL=openPage.js.map