import { BaseViewComponent } from "../BaseViewComponent";
import { CoreUtils, GameEvent } from "../../core";
import { WheelComponent } from "./WheelComponent";
import { APP_HEIGHT, APP_WIDTH } from "../../config";
import { Text } from "pixi.js";
import { CoinShower } from "./CoinShower";

export class GameScreen extends BaseViewComponent {
  private wheelComponent: WheelComponent;
  private coinShower: CoinShower;
  private messageText: Text;

  constructor(core: CoreUtils) {
    super(core);
    this.wheelComponent = new WheelComponent(this.core);
    this.coinShower = new CoinShower(this.core);
    this.messageText = new Text({
      style: {
        fill: "#ffffff",
        fontSize: 36,
        fontFamily: "Arial",
        stroke: "#000000",
      },
    });

    this.init();
  }

  protected init(): void {
    this.core.events.addListener(
      GameEvent.SHOW_GAME_SCREEN,
      this.setInteractive.bind(this, true),
    );
    this.core.events.addListener(
      GameEvent.SPIN_REQUESTED,
      this.onSpinRequested.bind(this),
    );
    this.core.events.addListener(
      GameEvent.SPIN_COMPLETE,
      this.onSpinComplete.bind(this),
    );
    this.core.events.addListener(GameEvent.SHOW_WIN, this.onShowWin.bind(this));
    this.core.events.addListener(
      GameEvent.SHOW_WIN_COMPLETE,
      this.onShowWinComplete.bind(this),
    );
    this.wheelComponent.position.set(APP_WIDTH / 2, APP_HEIGHT / 2);
    this.addChild(this.wheelComponent);

    this.messageText.text = this.core.gameSettings.readyText;
    this.messageText.anchor.set(0.5, 0.5);
    this.messageText.x = APP_WIDTH / 2;
    this.messageText.y = APP_HEIGHT - 100;
    this.addChild(this.messageText);

    this.app.stage.addEventListener("pointerdown", this.onClick.bind(this));
    this.setInteractive(false);

    this.coinShower.position.set(APP_WIDTH / 2, APP_HEIGHT);
    this.addChild(this.coinShower);
  }

  private onClick(): void {
    this.setInteractive(false);
    this.gameController.requestSpin();
  }

  private setInteractive(value: boolean): void {
    this.app.stage.interactive = value;
    this.app.stage.cursor = value ? "pointer" : "default";
  }

  private onSpinComplete(): void {
    this.messageText.text = this.core.gameSettings.readyText;
    this.setInteractive(true);
  }

  private onShowWin(value: number): void {
    this.messageText.text = this.core.gameSettings.winText.replace(
      "{value}",
      value.toString(),
    );
    this.setInteractive(false);

    if (value >= this.core.gameSettings.bigWinThreshold) {
      this.coinShower.start();
    }
  }
  private onShowWinComplete(): void {
    this.messageText.text = this.core.gameSettings.readyText;
    this.coinShower.stop();
    this.setInteractive(true);
  }

  private onSpinRequested(): void {
    this.messageText.text = this.core.gameSettings.spinningText;
  }
}
