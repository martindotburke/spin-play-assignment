import { BaseViewComponent } from "../BaseViewComponent";
import { CoreUtils, GameEvent } from "../../core";
import { WheelComponent } from "./WheelComponent";
import { APP_HEIGHT, APP_WIDTH } from "../../config";
import { Text } from "pixi.js";

export class GameScreen extends BaseViewComponent {
    private wheelComponent: WheelComponent;
    private messageText: Text;

    constructor(core: CoreUtils) {
        super(core);
        this.wheelComponent = new WheelComponent(this.core);
        this.messageText = new Text({
            style: {
                fill: '#ffffff',
                fontSize: 36,
                fontFamily: 'Arial',
                stroke: '#000000'
            }
        });
        
        this.init();
    }

    protected init(): void {
        this.core.events.addListener(GameEvent.SPIN_REQUESTED, this.onSpinRequested.bind(this));
        this.core.events.emit(GameEvent.SPIN_COMPLETE, this.onSpinComplete.bind(this));
        this.wheelComponent.position.set(APP_WIDTH / 2, APP_HEIGHT / 2);
        this.addChild(this.wheelComponent);

        this.messageText.text = this.core.gameSettings.readyText;
        this.messageText.anchor.set(0.5, 0.5);
        this.messageText.x = APP_WIDTH / 2;
        this.messageText.y = APP_HEIGHT - 100;
        this.addChild(this.messageText);
    }

    private onSpinComplete(): void {
        this.messageText.text = this.core.gameSettings.readyText;
    }

    private onSpinRequested(): void {
        this.messageText.text = this.core.gameSettings.spinningText;
    }
}