import { Sprite } from "pixi.js";
import { CoreUtils, GameEvent } from "../core";
import { BaseViewComponent } from "./BaseViewComponent";
import { GameScreen } from "./game/GameScreen";
import { GameUI } from "./game-ui/GameUI";
import { SplashScreen } from "./splash/TitleScreen";
import { APP_HEIGHT, APP_WIDTH } from "../config";

export class RootView extends BaseViewComponent {
    private readonly splashScreen: SplashScreen;
    private readonly gameScreen: GameScreen;
    private readonly gameUI: GameUI;

    constructor(core: CoreUtils) {
        super(core);
        this.splashScreen = new SplashScreen(core);
        this.gameScreen = new GameScreen(core);
        this.gameUI = new GameUI(core);
        this.init();
    }

    protected init(): void {
        this.core.events.on(GameEvent.SHOW_TITLE_SCREEN, () => { this.showSplashScreen(); });
        this.core.events.on(GameEvent.SHOW_GAME_SCREEN, () => { this.showGameScreen(); });

        const background = new Sprite(this.assetManager.getAsset("background"));
        background.width = APP_WIDTH;
        background.height = APP_HEIGHT;
        this.addChild(background);
        this.addChild(this.splashScreen);
        this.addChild(this.gameScreen);
        this.addChild(this.gameUI);
    }

    private showSplashScreen() {
        this.splashScreen.visible = true;
        this.gameScreen.visible = false;
    }

    private showGameScreen() {
        this.splashScreen.visible = false;
        this.gameScreen.visible = true;
    }
}