import { Text } from "pixi.js";
import { BaseViewComponent } from "../BaseViewComponent";
import { CoreUtils, GameEvent } from "../../core";
import { Button } from "../Button";
import { APP_HEIGHT, APP_WIDTH } from "../../config";

export class SplashScreen extends BaseViewComponent {
    constructor(core: CoreUtils) {
        super(core);
        this.init();
    }

    protected init(): void {
        const title = new Text({
            text: 'Wheel Spin 2000!',
            style: {
                fill: '#ffffff',
                fontSize: 72,
                fontFamily: 'Arial',
                stroke: '#000000'
            },
            anchor: 0.5
        });
        title.anchor.set(0.5, 0.5);
        title.x = APP_WIDTH / 2;
        title.y = APP_HEIGHT / 2;
        this.addChild(title);

        const startButton = new Button('Start Game');
        startButton.x = (APP_WIDTH - startButton.width) / 2;
        startButton.y = APP_HEIGHT / 2 + 100;
        startButton.on('pointerdown', this.onStartGameClicked.bind(this));
        this.addChild(startButton);

        //TODO - Add a call to action animation (cancel when clicked)
    }

    private async onStartGameClicked(): Promise<void> {
        await this.gameController.requestGameData();
        this.core.events.emit(GameEvent.SHOW_GAME_SCREEN);
    }
}