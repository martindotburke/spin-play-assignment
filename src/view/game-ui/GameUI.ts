import { BaseViewComponent } from "../BaseViewComponent";
import { CoreUtils, GameEvent } from "../../core";
import { BitmapText, FillGradient, Graphics } from "pixi.js";
import { APP_HEIGHT, APP_WIDTH } from "../../config";
import { gsap } from "gsap";

export class GameUI extends BaseViewComponent {
  private readonly padding: number = 10;
  private balanceText: BitmapText;
  public balanceAmount: number = 1000.0;

  constructor(core: CoreUtils) {
    super(core);

    this.balanceText = new BitmapText({
      text: "0123456789.,$",
      style: {
        fontFamily: "Arial",
        fontSize: 44,
        fill: "#ffcc00",
      },
      anchor: 0.5,
    });

    this.init();
  }

  protected init(): void {
    this.core.events.addListener(
      GameEvent.SHOW_WIN,
      this.countUpWin.bind(this),
    );
    this.core.events.addListener(
      GameEvent.GAME_DATA_RECEIVED,
      this.initPlayerData.bind(this),
    );
    const background = new Graphics()
      .roundRect(this.padding, this.padding, APP_WIDTH - 2 * this.padding, 50)
      .stroke({ color: 0xead070, width: 10 })
      .fill(
        new FillGradient({
          end: { x: 0, y: 1 },
          colorStops: [
            { color: 0xbca243, offset: 0 },
            { color: 0x6b5c28, offset: 1 },
          ],
        }),
      );
    this.addChild(background);

    this.setBalanceText(0);
    this.balanceText.x = APP_WIDTH / 2;
    this.balanceText.y = 36;
    this.addChild(this.balanceText);

    this.bottomAlign();
  }

  private initPlayerData(): void {
    const gameData = this.dataStore.gameData;
    if (gameData) {
      this.balanceAmount = gameData.playerBalance;
      this.setBalanceText(this.balanceAmount);
    }
  }

  private setBalanceText(amount: number) {
    this.balanceText.text = amount > 0 ? `$${amount.toFixed(2)}` : "";
  }

  private bottomAlign() {
    this.y = APP_HEIGHT - this.height - this.padding;
  }

  private countUpWin(winAmount: number): void {
    this.soundController.playCreditsRollup();
    const isBigWin = winAmount >= this.core.gameSettings.bigWinThreshold;
    const duration =
      this.core.gameSettings[
        isBigWin ? "bigWinCountUpDuration" : "winCountUpDuration"
      ];

    gsap.to(this, {
      balanceAmount: this.balanceAmount + winAmount,
      duration: duration,
      ease: "none",
      onUpdate: () => {
        this.setBalanceText(this.balanceAmount);
      },
      onComplete: () => {
        this.soundController.stopCreditsRollup();
        this.gameController.notifyWinComplete();
      },
    });
  }
}
