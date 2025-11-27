import { BaseViewComponent } from "../BaseViewComponent";
import { CoreUtils } from "../../core";
import { BitmapText, FillGradient, Graphics } from "pixi.js";
import { APP_HEIGHT, APP_WIDTH } from "../../config";

export class GameUI extends BaseViewComponent {
    private readonly padding: number = 10;
    private balanceText: BitmapText;
    private balanceAmount: number = 1000.00;
    
    constructor(core: CoreUtils) {
        super(core);
        
        const background = new Graphics()
            .roundRect(this.padding, this.padding, APP_WIDTH - 2 * this.padding, 50)
            .stroke({ color: 0xead070, width: 10 })
            .fill(new FillGradient({
                end: { x: 0, y: 1 },
                colorStops: [
                    { color: 0xbca243, offset: 0 },
                    { color: 0x6b5c28, offset: 1 }
                ]
            }));
        this.addChild(background);

        this.balanceText = new BitmapText({
            text: '0123456789.,$',
            style: {
                fontFamily: 'Arial',
                fontSize: 44,
                fill: '#ffcc00'
            },
            anchor: 0.5
        });
        this.setBalanceText(this.balanceAmount);
        this.balanceText.x = APP_WIDTH / 2;
        this.balanceText.y = 36;
        this.addChild(this.balanceText);

        this.bottomAlign();
    }

    private setBalanceText(amount: number) {
        this.balanceText.text = `$${amount.toFixed(2)}`;
    }

    private bottomAlign() {
        this.y = APP_HEIGHT - this.height - this.padding;
    }
}