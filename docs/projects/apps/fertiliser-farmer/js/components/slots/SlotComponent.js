import FullScreenModal from '../FullScreenModal.js';
import Reel from './Reel.js';
customElements.define('sce-reel', Reel);
export default class SlotComponent extends FullScreenModal {
    constructor() {
        super(...arguments);
        this.reelCount = 3;
        this.reels = [];
    }
    applyStyles() {
        super.applyStyles();
        let style = new CSSStyleSheet;
        style.replace(`
        #reel-grid {
            display: grid;
            grid-template-columns: ${(() => {
            let str = '';
            for (let i = 0; i < this.reelCount; i++) {
                str += '1fr ';
            }
            return str;
        })()};
            grid-gap: 10px;
            height: 64px;
            width: ${48 * this.reelCount}px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
        }

        sce-reel {
            width: 48px;
            height: 64px;
            background-color: white;
        }
        `);
        this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, style];
    }
    connectedCallback() {
        super.connectedCallback();
        this.reelGrid = document.createElement('div');
        this.reelGrid.id = 'reel-grid';
        for (let i = 0; i < this.reelCount; i++) {
            let reel = new Reel;
            reel.init(i + 1);
            reel.subscribe('win', (data) => console.log('reel ' + i + ': ' + data));
            this.reels.push(reel);
            this.reelGrid.appendChild(reel);
        }
        for (let i = 0; i < this.reelCount; i++) {
            let stop = document.createElement('button');
            stop.textContent = 'Stop';
            stop.addEventListener('click', e => {
                this.reels[i].stop();
            });
            this.reelGrid.appendChild(stop);
        }
        this.reelGrid.appendChild(document.createElement('div'));
        let spin = document.createElement('button');
        spin.textContent = 'spin';
        spin.addEventListener('click', e => {
            this.reels.forEach(r => r.spin());
        });
        this.reelGrid.appendChild(spin);
        this.content.appendChild(this.reelGrid);
        this.animHandle = requestAnimationFrame(this.rafReels.bind(this));
    }
    rafReels(t) {
        this.reels.forEach(el => el.draw());
        this.animHandle = requestAnimationFrame(this.rafReels.bind(this));
    }
    disconnectedCallback() {
        cancelAnimationFrame(this.animHandle);
    }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvc2xvdHMvU2xvdENvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLGVBQWUsTUFBTSx1QkFBdUIsQ0FBQztBQUNwRCxPQUFPLElBQUksTUFBTSxXQUFXLENBQUM7QUFDN0IsY0FBYyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFeEMsTUFBTSxDQUFDLE9BQU8sT0FBTyxhQUFjLFNBQVEsZUFBZTtJQUExRDs7UUFDSSxjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBRWQsVUFBSyxHQUFXLEVBQUUsQ0FBQztJQXFGdkIsQ0FBQztJQWpGRyxXQUFXO1FBQ1AsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRXBCLElBQUksS0FBSyxHQUFHLElBQUksYUFBYSxDQUFDO1FBRTlCLEtBQUssQ0FBQyxPQUFPLENBQUM7OztxQ0FHZSxDQUFDLEdBQUcsRUFBRTtZQUMzQixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDckMsR0FBRyxJQUFJLE1BQU0sQ0FBQzthQUNqQjtZQUNELE9BQU8sR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFDLEVBQUU7OztxQkFHSyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVM7Ozs7Ozs7Ozs7Ozs7U0FhL0IsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUN2RixDQUFDO0lBRUQsaUJBQWlCO1FBQ2IsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLFdBQVcsQ0FBQztRQUcvQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQztZQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25DO1FBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckMsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztZQUMxQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFBO1lBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbkM7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFekQsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztRQUMxQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVoQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxRQUFRLENBQUMsQ0FBQztRQUNOLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxvQkFBb0I7UUFDaEIsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7Q0FDSiIsImZpbGUiOiJjb21wb25lbnRzL3Nsb3RzL1Nsb3RDb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRnVsbFNjcmVlbk1vZGFsIGZyb20gJy4uL0Z1bGxTY3JlZW5Nb2RhbC5qcyc7XG5pbXBvcnQgUmVlbCBmcm9tICcuL1JlZWwuanMnO1xuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdzY2UtcmVlbCcsIFJlZWwpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTbG90Q29tcG9uZW50IGV4dGVuZHMgRnVsbFNjcmVlbk1vZGFsIHtcbiAgICByZWVsQ291bnQgPSAzO1xuICAgIHJlZWxHcmlkOiBIVE1MRGl2RWxlbWVudDtcbiAgICByZWVsczogUmVlbFtdID0gW107XG5cbiAgICBhbmltSGFuZGxlOiBudW1iZXI7XG5cbiAgICBhcHBseVN0eWxlcygpIHtcbiAgICAgICAgc3VwZXIuYXBwbHlTdHlsZXMoKTtcblxuICAgICAgICBsZXQgc3R5bGUgPSBuZXcgQ1NTU3R5bGVTaGVldDtcblxuICAgICAgICBzdHlsZS5yZXBsYWNlKGBcbiAgICAgICAgI3JlZWwtZ3JpZCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAkeygoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHN0ciA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yZWVsQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJzFmciAnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICAgICAgfSkoKX07XG4gICAgICAgICAgICBncmlkLWdhcDogMTBweDtcbiAgICAgICAgICAgIGhlaWdodDogNjRweDtcbiAgICAgICAgICAgIHdpZHRoOiAkezQ4ICogdGhpcy5yZWVsQ291bnR9cHg7XG4gICAgICAgICAgICBtYXJnaW4tbGVmdDogYXV0bztcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogYXV0bztcbiAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgICAgIHRvcDogNTAlO1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2NlLXJlZWwge1xuICAgICAgICAgICAgd2lkdGg6IDQ4cHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDY0cHg7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgICAgICAgfVxuICAgICAgICBgKVxuXG4gICAgICAgIHRoaXMuc2hhZG93Um9vdC5hZG9wdGVkU3R5bGVTaGVldHMgPSBbLi4udGhpcy5zaGFkb3dSb290LmFkb3B0ZWRTdHlsZVNoZWV0cywgc3R5bGVdXG4gICAgfVxuXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cbiAgICAgICAgdGhpcy5yZWVsR3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLnJlZWxHcmlkLmlkID0gJ3JlZWwtZ3JpZCc7XG5cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmVlbENvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGxldCByZWVsID0gbmV3IFJlZWw7XG4gICAgICAgICAgICByZWVsLmluaXQoaSArIDEpO1xuICAgICAgICAgICAgcmVlbC5zdWJzY3JpYmUoJ3dpbicsIChkYXRhKSA9PiBjb25zb2xlLmxvZygncmVlbCAnICsgaSArICc6ICcgKyBkYXRhKSk7XG4gICAgICAgICAgICB0aGlzLnJlZWxzLnB1c2gocmVlbCk7XG4gICAgICAgICAgICB0aGlzLnJlZWxHcmlkLmFwcGVuZENoaWxkKHJlZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJlZWxDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc3RvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICAgICAgc3RvcC50ZXh0Q29udGVudCA9ICdTdG9wJztcbiAgICAgICAgICAgIHN0b3AuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZWxzW2ldLnN0b3AoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLnJlZWxHcmlkLmFwcGVuZENoaWxkKHN0b3ApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWVsR3JpZC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG5cbiAgICAgICAgbGV0IHNwaW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgc3Bpbi50ZXh0Q29udGVudCA9ICdzcGluJztcbiAgICAgICAgc3Bpbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWVscy5mb3JFYWNoKHIgPT4gci5zcGluKCkpO1xuICAgICAgICB9KVxuICAgICAgICB0aGlzLnJlZWxHcmlkLmFwcGVuZENoaWxkKHNwaW4pO1xuXG4gICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLnJlZWxHcmlkKTtcblxuICAgICAgICB0aGlzLmFuaW1IYW5kbGUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yYWZSZWVscy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICByYWZSZWVscyh0KSB7XG4gICAgICAgIHRoaXMucmVlbHMuZm9yRWFjaChlbCA9PiBlbC5kcmF3KCkpO1xuICAgICAgICB0aGlzLmFuaW1IYW5kbGUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yYWZSZWVscy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltSGFuZGxlKTtcbiAgICB9XG59Il19