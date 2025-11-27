import { Text } from "pixi.js";
import { BaseViewComponent } from "../BaseViewComponent";
import { CoreUtils, GameEvent } from "../../core";
import { Button } from "../Button";
import { APP_HEIGHT, APP_WIDTH } from "../../config";
import { gsap } from "gsap";

export class SplashScreen extends BaseViewComponent {
  private buttonTween?: gsap.core.Tween;

  constructor(core: CoreUtils) {
    super(core);
    this.init();
  }

  protected init(): void {
    const title = new Text({
      text: this.core.gameSettings.titleText,
      style: {
        fill: "#ffffff",
        fontSize: 72,
        fontFamily: "Arial",
        stroke: "#000000",
      },
      anchor: 0.5,
    });
    title.anchor.set(0.5, 0.5);
    title.x = APP_WIDTH / 2;
    title.y = APP_HEIGHT / 2;
    this.addChild(title);

    const startButton = new Button("Start Game");
    startButton.x = APP_WIDTH / 2;
    startButton.y = APP_HEIGHT / 2 + 150;
    startButton.on("pointerdown", this.onStartGameClicked.bind(this));
    startButton.interactive = true;
    startButton.cursor = "pointer";
    this.addChild(startButton);

    startButton.scale = 1;
    this.buttonTween = gsap.to(
      { scale: 1 },
      {
        scale: 1.1,
        duration: 0.5,
        ease: "none",
        onUpdate: function () {
          startButton.scale = this.targets()[0].scale;
        },
        yoyo: true,
        repeat: -1,
      },
    );
  }

  private async onStartGameClicked(): Promise<void> {
    if (this.buttonTween) {
      this.buttonTween.kill();
      this.buttonTween = undefined;
    }
    await this.gameController.requestGameData();
    this.core.events.emit(GameEvent.SHOW_GAME_SCREEN);
  }
}
