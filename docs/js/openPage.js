import { fadeBoxesOut, retractLines } from './animations.js';
import { pages } from './main.js';
export function openPage(page) {
    page = pages[page.replace('#', '')];
    retractLines(() => {
        fadeBoxesOut(() => {
            page.render();
        });
    });
}
//# sourceMappingURL=openPage.js.map