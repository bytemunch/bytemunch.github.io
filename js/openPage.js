function openPage(page) {
    page = pages[page.replace('#', '')];
    retractLines(function () {
        fadeBoxesOut(function () {
            page.render();
        });
    });
}
