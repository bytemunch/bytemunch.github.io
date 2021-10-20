import { game } from "../main.js";
import { UpgradePanel } from "./UpgradePanel.js";
export class BounceUpgrade extends UpgradePanel {
    constructor(o) {
        super(o);
    }
    get name() {
        return 'Bounces';
    }
    get currentLevel() {
        return game.upgrades.bounces - 1;
    }
    doUpgrade() {
        game.upgrades.bounces++;
    }
}
//# sourceMappingURL=BounceUpgrade.js.map