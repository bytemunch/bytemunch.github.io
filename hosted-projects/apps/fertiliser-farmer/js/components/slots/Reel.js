import Observable from "../../class/Observable.js";
import applyMixins from "../../functions/applyMixins.js";
import fisherYates from "../../functions/fisherYates.js";
const odds = {
    'wild': 4,
    'poop': 3,
    'banana': 3,
    'cherry': 3,
    'bar': 2,
    '2bar': 2,
    '3bar': 2,
    'bag': 1,
    '7': 1,
    'diamond': 1,
};
const totalOdds = (() => {
    let to = 0;
    for (let o in odds) {
        to += odds[o];
    }
    // if (to % 2 == 0) 
    return to;
})();
class Fruit {
    constructor(type) {
        this.type = '';
        this.y = 64 / 2 - 48 / 2;
        if (!type)
            throw 'Cannot initialise fruit with no type!';
        this.type = type;
        this.loaded = new Promise(res => {
            this.img = new Image;
            this.img.addEventListener('load', e => {
                res();
            });
            this.img.src = './img/fruits/' + type + '.png';
        });
        applyMixins(Fruit, [Observable]);
    }
    draw(ctx, spin) {
        if (spin) {
            this.y += 10;
        }
        else {
            // align everything to winline
            this.y = 8 + Math.floor(this.y / 64) * 64;
        }
        ctx.drawImage(this.img, 0, this.y);
        if (this.y > 64) {
            // reset to top
            this.y = -64 * (totalOdds - 1);
        }
    }
}
class Reel extends HTMLElement {
    constructor() {
        super();
        this.spinning = false;
        this.finished = false;
        // TODO unlink from framerate
        this.spinDuration = 0;
        this.spinAge = 0;
        this.fruits = [];
        this.attachShadow({ mode: 'open' });
        applyMixins(Reel, [Observable]);
        this.cnv = document.createElement('canvas');
        this.cnv.width = 48;
        this.cnv.height = 64;
        this.ctx = this.cnv.getContext('2d');
    }
    init(reelNum) {
        this.spinDuration = 3 * 60 + reelNum / 3 * 100;
    }
    async connectedCallback() {
        this.shadowRoot.appendChild(this.cnv);
        this.emit('test', 'abcd');
        await this.setup();
        this.draw();
        this.spin();
    }
    async setup() {
        this.fruits = [];
        this.spinAge = 0;
        for (let t in odds) {
            for (let i = 0; i < odds[t]; i++) {
                this.fruits.push(new Fruit(t));
            }
        }
        fisherYates(this.fruits);
        // Winline is at array[length-1];
        for (let i = 0; i < this.fruits.length; i++) {
            this.fruits[i].y -= i * 64;
        }
        return Promise.allSettled(this.fruits.map(f => f.loaded));
    }
    async spin() {
        if (this.spinning)
            return;
        await this.setup();
        this.spinning = true;
    }
    stop() {
        this.spinAge = this.spinDuration;
    }
    draw() {
        this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
        // UPDATE
        if (this.spinning) {
            this.spinAge++;
            if (this.spinAge >= this.spinDuration) {
                this.spinning = false;
                this.emit('win', this.fruits.filter(el => el.y > 0 && el.y < 64)[0].type);
            }
        }
        // DRAW
        for (let f of this.fruits) {
            f.draw(this.ctx, this.spinning);
        }
        // OVERLAY
        this.ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.cnv.height / 2);
        this.ctx.lineTo(this.cnv.width, this.cnv.height / 2);
        this.ctx.closePath();
        this.ctx.stroke();
    }
}
;
export default Reel;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvc2xvdHMvUmVlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFVBQVUsTUFBTSwyQkFBMkIsQ0FBQztBQUNuRCxPQUFPLFdBQVcsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN6RCxPQUFPLFdBQVcsTUFBTSxnQ0FBZ0MsQ0FBQztBQUV6RCxNQUFNLElBQUksR0FBRztJQUNULE1BQU0sRUFBRSxDQUFDO0lBQ1QsTUFBTSxFQUFFLENBQUM7SUFDVCxRQUFRLEVBQUUsQ0FBQztJQUNYLFFBQVEsRUFBRSxDQUFDO0lBQ1gsS0FBSyxFQUFFLENBQUM7SUFDUixNQUFNLEVBQUUsQ0FBQztJQUNULE1BQU0sRUFBRSxDQUFDO0lBQ1QsS0FBSyxFQUFFLENBQUM7SUFDUixHQUFHLEVBQUUsQ0FBQztJQUNOLFNBQVMsRUFBRSxDQUFDO0NBQ2YsQ0FBQTtBQUVELE1BQU0sU0FBUyxHQUFHLENBQUMsR0FBRyxFQUFFO0lBQ3BCLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNYLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO1FBQ2hCLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakI7SUFDRCxvQkFBb0I7SUFDcEIsT0FBTyxFQUFFLENBQUM7QUFDZCxDQUFDLENBQUMsRUFBRSxDQUFBO0FBRUosTUFBTSxLQUFLO0lBTVAsWUFBWSxJQUFZO1FBTHhCLFNBQUksR0FBVyxFQUFFLENBQUM7UUFFbEIsTUFBQyxHQUFXLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUl4QixJQUFJLENBQUMsSUFBSTtZQUFFLE1BQU0sdUNBQXVDLENBQUM7UUFDekQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFFakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM1QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDO1lB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QUFLLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM3RTtTQUNKO1FBRUQsT0FBTztRQUNQLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUN2QixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ25DO1FBRUQsVUFBVTtRQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLGlCQUFpQixDQUFDO1FBQ3pDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN0QixDQUFDO0NBQ0o7QUFFb0MsQ0FBQztBQUV0QyxlQUFlLElBQUksQ0FBQyIsImZpbGUiOiJjb21wb25lbnRzL3Nsb3RzL1JlZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT2JzZXJ2YWJsZSBmcm9tIFwiLi4vLi4vY2xhc3MvT2JzZXJ2YWJsZS5qc1wiO1xuaW1wb3J0IGFwcGx5TWl4aW5zIGZyb20gXCIuLi8uLi9mdW5jdGlvbnMvYXBwbHlNaXhpbnMuanNcIjtcbmltcG9ydCBmaXNoZXJZYXRlcyBmcm9tIFwiLi4vLi4vZnVuY3Rpb25zL2Zpc2hlcllhdGVzLmpzXCI7XG5cbmNvbnN0IG9kZHMgPSB7XG4gICAgJ3dpbGQnOiA0LFxuICAgICdwb29wJzogMyxcbiAgICAnYmFuYW5hJzogMyxcbiAgICAnY2hlcnJ5JzogMyxcbiAgICAnYmFyJzogMixcbiAgICAnMmJhcic6IDIsXG4gICAgJzNiYXInOiAyLFxuICAgICdiYWcnOiAxLFxuICAgICc3JzogMSxcbiAgICAnZGlhbW9uZCc6IDEsXG59XG5cbmNvbnN0IHRvdGFsT2RkcyA9ICgoKSA9PiB7XG4gICAgbGV0IHRvID0gMDtcbiAgICBmb3IgKGxldCBvIGluIG9kZHMpIHtcbiAgICAgICAgdG8gKz0gb2Rkc1tvXTtcbiAgICB9XG4gICAgLy8gaWYgKHRvICUgMiA9PSAwKSBcbiAgICByZXR1cm4gdG87XG59KSgpXG5cbmNsYXNzIEZydWl0IHtcbiAgICB0eXBlOiBzdHJpbmcgPSAnJztcbiAgICBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgeTogbnVtYmVyID0gNjQgLyAyIC0gNDggLyAyO1xuICAgIGxvYWRlZDogUHJvbWlzZTx2b2lkPjtcblxuICAgIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZykge1xuICAgICAgICBpZiAoIXR5cGUpIHRocm93ICdDYW5ub3QgaW5pdGlhbGlzZSBmcnVpdCB3aXRoIG5vIHR5cGUhJztcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcblxuICAgICAgICB0aGlzLmxvYWRlZCA9IG5ldyBQcm9taXNlKHJlcyA9PiB7XG4gICAgICAgICAgICB0aGlzLmltZyA9IG5ldyBJbWFnZTtcbiAgICAgICAgICAgIHRoaXMuaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBlID0+IHtcbiAgICAgICAgICAgICAgICByZXMoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLmltZy5zcmMgPSAnLi9pbWcvZnJ1aXRzLycgKyB0eXBlICsgJy5wbmcnO1xuICAgICAgICB9KVxuXG4gICAgICAgIGFwcGx5TWl4aW5zKEZydWl0LCBbT2JzZXJ2YWJsZV0pO1xuICAgIH1cblxuICAgIGRyYXcoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHNwaW46IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHNwaW4pIHtcbiAgICAgICAgICAgIHRoaXMueSArPSAxMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGFsaWduIGV2ZXJ5dGhpbmcgdG8gd2lubGluZVxuICAgICAgICAgICAgdGhpcy55ID0gOCArIE1hdGguZmxvb3IodGhpcy55IC8gNjQpICogNjQ7XG4gICAgICAgIH1cbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgMCwgdGhpcy55KTtcbiAgICAgICAgaWYgKHRoaXMueSA+IDY0KSB7XG4gICAgICAgICAgICAvLyByZXNldCB0byB0b3BcbiAgICAgICAgICAgIHRoaXMueSA9IC02NCAqICh0b3RhbE9kZHMgLSAxKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgUmVlbCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBjbnY6IEhUTUxDYW52YXNFbGVtZW50O1xuICAgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgc3Bpbm5pbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBmaW5pc2hlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLy8gVE9ETyB1bmxpbmsgZnJvbSBmcmFtZXJhdGVcbiAgICBzcGluRHVyYXRpb246IG51bWJlciA9IDA7XG4gICAgc3BpbkFnZTogbnVtYmVyID0gMDtcblxuICAgIGZydWl0czogRnJ1aXRbXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pO1xuICAgICAgICBhcHBseU1peGlucyhSZWVsLCBbT2JzZXJ2YWJsZV0pO1xuXG4gICAgICAgIHRoaXMuY252ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cbiAgICAgICAgdGhpcy5jbnYud2lkdGggPSA0ODtcbiAgICAgICAgdGhpcy5jbnYuaGVpZ2h0ID0gNjQ7XG5cbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNudi5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgfVxuXG4gICAgaW5pdChyZWVsTnVtOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5zcGluRHVyYXRpb24gPSAzICogNjAgKyByZWVsTnVtIC8gMyAqIDEwMDtcbiAgICB9XG5cbiAgICBhc3luYyBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5zaGFkb3dSb290LmFwcGVuZENoaWxkKHRoaXMuY252KTtcbiAgICAgICAgdGhpcy5lbWl0KCd0ZXN0JywgJ2FiY2QnKTtcblxuICAgICAgICBhd2FpdCB0aGlzLnNldHVwKCk7XG5cbiAgICAgICAgdGhpcy5kcmF3KCk7XG5cbiAgICAgICAgdGhpcy5zcGluKCk7XG5cbiAgICB9XG5cbiAgICBhc3luYyBzZXR1cCgpIHtcbiAgICAgICAgdGhpcy5mcnVpdHMgPSBbXTtcbiAgICAgICAgdGhpcy5zcGluQWdlID0gMDtcblxuICAgICAgICBmb3IgKGxldCB0IGluIG9kZHMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2Rkc1t0XTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mcnVpdHMucHVzaChuZXcgRnJ1aXQodCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZmlzaGVyWWF0ZXModGhpcy5mcnVpdHMpO1xuXG4gICAgICAgIC8vIFdpbmxpbmUgaXMgYXQgYXJyYXlbbGVuZ3RoLTFdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5mcnVpdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuZnJ1aXRzW2ldLnkgLT0gaSAqIDY0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsU2V0dGxlZCh0aGlzLmZydWl0cy5tYXAoZiA9PiBmLmxvYWRlZCkpO1xuICAgIH1cblxuICAgIGFzeW5jIHNwaW4oKSB7XG4gICAgICAgIGlmICh0aGlzLnNwaW5uaW5nKSByZXR1cm47XG5cbiAgICAgICAgYXdhaXQgdGhpcy5zZXR1cCgpO1xuXG4gICAgICAgIHRoaXMuc3Bpbm5pbmcgPSB0cnVlO1xuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuc3BpbkFnZSA9IHRoaXMuc3BpbkR1cmF0aW9uO1xuICAgIH1cblxuICAgIGRyYXcoKSB7XG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNudi53aWR0aCwgdGhpcy5jbnYuaGVpZ2h0KTtcbiAgICAgICAgLy8gVVBEQVRFXG4gICAgICAgIGlmICh0aGlzLnNwaW5uaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnNwaW5BZ2UrKztcbiAgICAgICAgICAgIGlmICh0aGlzLnNwaW5BZ2UgPj0gdGhpcy5zcGluRHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNwaW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd3aW4nLCB0aGlzLmZydWl0cy5maWx0ZXIoZWwgPT4gZWwueSA+IDAgJiYgZWwueSA8IDY0KVswXS50eXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERSQVdcbiAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLmZydWl0cykge1xuICAgICAgICAgICAgZi5kcmF3KHRoaXMuY3R4LCB0aGlzLnNwaW5uaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9WRVJMQVlcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgwLDAsMCwwLjgpJztcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCB0aGlzLmNudi5oZWlnaHQgLyAyKTtcbiAgICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMuY252LndpZHRoLCB0aGlzLmNudi5oZWlnaHQgLyAyKTtcbiAgICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIFJlZWwgZXh0ZW5kcyBPYnNlcnZhYmxlIHsgfTtcblxuZXhwb3J0IGRlZmF1bHQgUmVlbDsiXX0=