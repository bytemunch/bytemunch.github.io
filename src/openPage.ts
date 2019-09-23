function openPage(page) {
    //grab page object
    page = pages[page.replace('#', '')];

    retractLines(() => {
        fadeBoxesOut(() => {
            page.render();
        });
    });//TODO async/await
}