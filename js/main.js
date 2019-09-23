var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var frameCount = 0;
var frameRate = 30;
var rooturi = window.location.hostname;
var canvas = document.createElement('canvas');
canvas.style.position = 'absolute';
canvas.style.zIndex = '0';
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
var links = [];
var lineRunners = [];
function getPage(page) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, fetch('./pages/' + page + '.json')];
                case 1:
                    res = _a.sent();
                    return [2, res.json()];
            }
        });
    });
}
function reRange(val, min1, max1, min2, max2) {
    var percent = (val - min1) / (max1 - min1);
    var newVal = min2 + ((max2 - min2) * percent);
    return newVal;
}
var pages = {
    about: new Page('about'),
    funstuff: new Page('funstuff'),
    portfolio: new Page('portfolio'),
    home: new Page('home')
};
links.push(new Link("./img/about.png", "#about", "me"));
links.push(new Link("./img/work.png", "#portfolio", "work"));
links.push(new Link("./img/play.png", "#funstuff", "play"));
var scale = 1;
var width;
var height;
var linew;
var maxw;
var maxh;
var minw;
var minh;
var drawLoopId;
addAllRunners();
function addAllRunners(cb) {
    var boxes = document.querySelectorAll('.linkbox');
    for (var _i = 0, boxes_1 = boxes; _i < boxes_1.length; _i++) {
        var box = boxes_1[_i];
        var bb = box.getBoundingClientRect();
        bb.width -= 2 * linew;
        bb.height -= 2 * linew;
        addRunners(bb, box);
    }
    if (cb)
        cb();
}
function addRunners(pos, parent) {
    lineRunners.push(new LineRunner(pos.x, pos.y, 'y', -1, parent));
    lineRunners.push(new LineRunner(pos.x, pos.y, 'x', -1, parent));
    lineRunners.push(new LineRunner(pos.x + pos.width + linew, pos.y, 'y', -1, parent));
    lineRunners.push(new LineRunner(pos.x + pos.width + linew, pos.y, 'x', 1, parent));
    lineRunners.push(new LineRunner(pos.x, pos.y + pos.height + linew, 'y', 1, parent));
    lineRunners.push(new LineRunner(pos.x, pos.y + pos.height + linew, 'x', -1, parent));
    lineRunners.push(new LineRunner(pos.x + pos.width + linew, pos.y + pos.height + linew, 'y', 1, parent));
    lineRunners.push(new LineRunner(pos.x + pos.width + linew, pos.y + pos.height + linew, 'x', 1, parent));
}
setTimeout(function () {
    fadeIn([document.body], 0.05);
}, 150);
function resetCanvas() {
    console.log('cnvreset');
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.height = height;
    canvas.width = width;
    width > height ? linew = height * 0.01 : linew = width * 0.01;
    linew = Math.floor(linew);
    maxw = (width / 4) * scale;
    maxh = (height / 4) * scale;
    minw = (width / 6) * scale;
    minh = (height / 6) * scale;
    var oldHeader = document.querySelector('#header');
    if (oldHeader)
        oldHeader.parentElement.removeChild(oldHeader);
    var headerWidth = width < height ? width * 0.7 : width * 0.55;
    var headerPos = {
        x: -linew * 2,
        y: -linew * 2,
        width: headerWidth,
        height: headerWidth * 0.1
    };
    var header = newDiv(headerPos, './img/home.png', '#home');
    if (header) {
        document.body.appendChild(header);
        header.firstChild.style.backgroundColor = 'white';
        header.firstChild.classList.add('home');
        header.id = 'header';
        header.firstChild.removeChild(header.firstChild.firstChild);
    }
    openPage(location.hash.replace('#', '') || 'home');
}
window.addEventListener('resize', resetCanvas);
document.addEventListener('DOMContentLoaded', resetCanvas);
