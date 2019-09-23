function finishedAnimation() {
}
function fadeOut(elements, speed, cb) {
    if (!elements[0]) {
        cb();
    }
    else {
        var o = parseFloat(elements[0].style.opacity) || 1;
        o -= speed;
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            element.style.opacity = o;
        }
        if (o > 0) {
            window.requestAnimationFrame(function (ts) {
                fadeOut(elements, speed, cb);
            });
        }
        else {
            for (var _a = 0, elements_2 = elements; _a < elements_2.length; _a++) {
                var el = elements_2[_a];
                el.parentElement.tagName == 'A' ?
                    el.parentElement.parentElement.removeChild(el.parentElement) :
                    el.parentElement.removeChild(el);
            }
            if (cb)
                cb();
        }
    }
}
function fadeIn(elements, speed, cb) {
    var o = parseFloat(elements[0].style.opacity) || 0;
    o += speed;
    for (var _i = 0, elements_3 = elements; _i < elements_3.length; _i++) {
        var element = elements_3[_i];
        element.style.opacity = o;
    }
    if (o < 1) {
        window.requestAnimationFrame(function (ts) {
            fadeIn(elements, speed, cb);
        });
    }
    else {
        if (cb)
            cb();
    }
}
function drawLines(cb) {
    ctx.clearRect(0, 0, width, height);
    var live = false;
    for (var _i = 0, lineRunners_1 = lineRunners; _i < lineRunners_1.length; _i++) {
        var lr = lineRunners_1[_i];
        lr.line.draw();
        if (!lr.dead) {
            live = true;
            lr.update();
        }
    }
    if (live) {
        window.requestAnimationFrame(function (ts) {
            drawLines(cb);
        });
    }
    else {
        if (cb)
            cb();
    }
}
function retractLines(cb) {
    ctx.clearRect(0, 0, width, height);
    var live = false;
    for (var _i = 0, lineRunners_2 = lineRunners; _i < lineRunners_2.length; _i++) {
        var lr = lineRunners_2[_i];
        lr.revive();
        lr.retract();
        if (!lr.dead) {
            lr.line.draw();
            live = true;
        }
    }
    if (live) {
        window.requestAnimationFrame(function (ts) {
            retractLines(cb);
        });
    }
    else {
        lineRunners = [];
        if (cb)
            cb();
    }
}
function fadeBoxesOut(cb) {
    var boxes = Array.from(document.querySelectorAll('.linkbox'));
    boxes.splice(boxes.indexOf(document.querySelector('.home')), 1);
    fadeOut(boxes, 0.05, cb);
}
