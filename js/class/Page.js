var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var Page = (function () {
    function Page(name) {
        this.name = name;
        this.complexity = 4;
    }
    Page.prototype.render = function () {
        return __awaiter(this, void 0, void 0, function () {
            var divs, mainpos, main, titlediv, title, text, links_4, linkColor, _i, links_1, link, linkDiv, desc, titleDiv, htmlLink, linkImg, githubLink, githubImg, links_5, linkColor, _a, links_2, link, linkDiv, desc, titleDiv, htmlLink, linkImg, githubLink, githubImg, _b, links_3, l, pos, div, i_1, ipos, image, space, i, pos, div;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, getPage(this.name)
                            .then(function (res) {
                            _this.main = res.main || 'empty';
                            _this.images = res.images || 'empty';
                        })];
                    case 1:
                        _c.sent();
                        divs = [];
                        if (this.main && this.main !== 'empty') {
                            mainpos = findSpace(width / 1.5, width / 1.7, height / 1.5, height / 2);
                            mainpos = {
                                x: width / 24,
                                y: height / 7,
                                width: width / 1.5,
                                height: height / 1.5
                            };
                            if (mainpos.width < 260) {
                                mainpos.width = 260;
                                mainpos.x = 5;
                                mainpos.y = 25;
                            }
                            main = newDiv(mainpos);
                            main.style.overflowX = 'hidden';
                            main.style.overflowY = 'auto';
                            if (main) {
                                titlediv = document.createElement('div');
                                title = document.createElement('h3');
                                text = document.createElement('p');
                                titlediv.classList.add('linkbox');
                                titlediv.classList.add('maintitle');
                                titlediv.style.width = 'calc(100% - ' + (linew * 2) + 'px)';
                                titlediv.style.position = 'relative';
                                titlediv.style.marginLeft = -linew + '';
                                titlediv.style.marginTop = -linew + '';
                                titlediv.style.marginBottom = linew;
                                titlediv.style.borderWidth = linew;
                                titlediv.style.paddingLeft = linew;
                                titlediv.style.paddingRight = linew;
                                titlediv.style.backgroundColor = 'white';
                                main.classList.add(this.main.title.replace(' ', '-'));
                                title.textContent = this.main.title || 'TITLE 404';
                                text.textContent = this.main.text || 'TEXT 404';
                                titlediv.appendChild(title);
                                titlediv.appendChild(text);
                                main.appendChild(titlediv);
                                divs.push(main);
                                document.body.appendChild(main);
                            }
                            if (this.name == 'portfolio') {
                                links_4 = [
                                    {
                                        text: 'JHE Electrical',
                                        link: 'https://bytemunch.github.io/jhe-draft/',
                                        desc: 'A draft site for a friend. I didn\'t design the logo, but did add the animations.',
                                        repo: 'https://github.com/bytemunch/jhe'
                                    },
                                    {
                                        text: 'Drink!',
                                        link: 'https://ring-of-fire-5d1a4.web.app/',
                                        desc: 'A multiplayer realtime drinking game app. In active (eternal) development.',
                                        repo: ''
                                    },
                                    {
                                        text: 'Fresh Decorators',
                                        link: 'https://bytemunch.github.io/fresh/index.html',
                                        desc: 'A site I was partway through making when the client decided they didn\'t want it anymore. Takeaway: get contracts signed for freelance work!',
                                        repo: ''
                                    },
                                ];
                                linkColor = 'white';
                                if (main.style.backgroundColor === 'white' || main.style.backgroundColor === 'yellow') {
                                    linkColor = 'black';
                                }
                                for (_i = 0, links_1 = links_4; _i < links_1.length; _i++) {
                                    link = links_1[_i];
                                    linkDiv = document.createElement('div');
                                    desc = document.createElement('p');
                                    desc.textContent = link.desc;
                                    desc.style.color = linkColor;
                                    desc.style.marginLeft = (linew * 2) + '';
                                    desc.style.marginBottom = (linew * 2) + '';
                                    titleDiv = document.createElement('div');
                                    htmlLink = document.createElement('a');
                                    htmlLink.textContent = link.text;
                                    htmlLink.href = link.link;
                                    htmlLink.target = '_blank';
                                    htmlLink.style.margin = linew;
                                    htmlLink.style.color = linkColor;
                                    htmlLink.style.fontWeight = 'bold';
                                    linkImg = document.createElement('img');
                                    linkImg.src = linkColor == 'black' ? './img/link-24px.png' : './img/link-24px-light.png';
                                    linkImg.classList.add('linkimg');
                                    htmlLink.appendChild(linkImg);
                                    titleDiv.appendChild(htmlLink);
                                    if (link.repo) {
                                        githubLink = document.createElement('a');
                                        githubLink.href = link.repo;
                                        githubLink.target = '_blank';
                                        githubImg = document.createElement('img');
                                        githubImg.src = linkColor == 'black' ? './img/GitHub-Mark-32px.png' : './img/GitHub-Mark-Light-32px.png';
                                        githubImg.classList.add('linkimg');
                                        githubLink.appendChild(githubImg);
                                        titleDiv.appendChild(githubLink);
                                    }
                                    linkDiv.appendChild(titleDiv);
                                    linkDiv.appendChild(desc);
                                    main.appendChild(linkDiv);
                                }
                            }
                            if (this.name == 'funstuff') {
                                links_5 = [
                                    {
                                        text: 'Shitty Ball Game',
                                        link: 'https://bytemunch.github.io/apps/shitty-ball-game',
                                        desc: 'September 2021. Does what it says on the tin, it\'s another shitty ball game!.',
                                        repo: ''
                                    },
                                    {
                                        text: 'Advertising Game',
                                        link: 'https://bytemunch.github.io/apps/advert',
                                        desc: 'March 2020. My take on an idle game. Not sure where I was going with it, but I got halfway there! Wherever there is...',
                                        repo: ''
                                    },
                                    {
                                        text: 'Meme Man Facebook App',
                                        link: 'https://meme-man-test.web.app/',
                                        desc: 'March 2020. A zero effort facebook test. Made one morning to get a better handle on Facebook APIs',
                                        repo: 'https://github.com/bytemunch/meme-man-test'
                                    },
                                ];
                                linkColor = 'white';
                                if (main.style.backgroundColor === 'white' || main.style.backgroundColor === 'yellow') {
                                    linkColor = 'black';
                                }
                                for (_a = 0, links_2 = links_5; _a < links_2.length; _a++) {
                                    link = links_2[_a];
                                    linkDiv = document.createElement('div');
                                    desc = document.createElement('p');
                                    desc.textContent = link.desc;
                                    desc.style.color = linkColor;
                                    desc.style.marginLeft = (linew * 2) + '';
                                    desc.style.marginBottom = (linew * 2) + '';
                                    titleDiv = document.createElement('div');
                                    htmlLink = document.createElement('a');
                                    htmlLink.textContent = link.text;
                                    htmlLink.href = link.link;
                                    htmlLink.target = '_blank';
                                    htmlLink.style.margin = linew;
                                    htmlLink.style.color = linkColor;
                                    htmlLink.style.fontWeight = 'bold';
                                    linkImg = document.createElement('img');
                                    linkImg.src = linkColor == 'black' ? './img/link-24px.png' : './img/link-24px-light.png';
                                    linkImg.classList.add('linkimg');
                                    htmlLink.appendChild(linkImg);
                                    titleDiv.appendChild(htmlLink);
                                    if (link.repo) {
                                        githubLink = document.createElement('a');
                                        githubLink.href = link.repo;
                                        githubLink.target = '_blank';
                                        githubImg = document.createElement('img');
                                        githubImg.src = linkColor == 'black' ? './img/GitHub-Mark-32px.png' : './img/GitHub-Mark-Light-32px.png';
                                        githubImg.classList.add('linkimg');
                                        githubLink.appendChild(githubImg);
                                        titleDiv.appendChild(githubLink);
                                    }
                                    linkDiv.appendChild(titleDiv);
                                    linkDiv.appendChild(desc);
                                    main.appendChild(linkDiv);
                                }
                            }
                        }
                        for (_b = 0, links_3 = links; _b < links_3.length; _b++) {
                            l = links_3[_b];
                            if (l.link.replace('#', '') !== this.name) {
                                pos = findSpace(maxw, minw, maxh, minh);
                                div = newDiv(pos, l.img, l.link, l.txt);
                                if (div) {
                                    divs.push(div);
                                    document.body.appendChild(div);
                                }
                            }
                        }
                        if (this.images !== 'empty') {
                            for (i_1 in this.images) {
                                ipos = findSpace(maxw, minw, maxh, minh);
                                image = newDiv(ipos, this.images[i_1]);
                                if (image) {
                                    divs.push(image);
                                    document.body.appendChild(image);
                                }
                            }
                        }
                        space = true;
                        i = 0;
                        while (space && i < this.complexity) {
                            i++;
                            pos = findSpace(maxw, minw, maxh, minh);
                            if (pos) {
                                div = newDiv(pos);
                                if (div)
                                    document.body.appendChild(div);
                            }
                            else {
                                space = false;
                            }
                        }
                        fadeIn(divs, 0.05, function () {
                            addAllRunners(function () {
                                drawLines(function () {
                                    finishedAnimation();
                                });
                            });
                        });
                        return [2];
                }
            });
        });
    };
    return Page;
}());
