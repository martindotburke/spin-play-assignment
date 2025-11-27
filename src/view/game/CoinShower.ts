import { Emitter, EmitterConfigV3 } from "@barvynkoa/particle-emitter";
import { BaseViewComponent } from "../BaseViewComponent";
import { CoreUtils } from "../..";
import { Ticker } from "pixi.js";

export class CoinShower extends BaseViewComponent {
  private emitter: Emitter;

  constructor(core: CoreUtils) {
    super(core);
    this.emitter = new Emitter(this, this.getEmitterConfig());
    this.emitter.emit = false;
    this.app.ticker.add(this.update, this);
  }

  public start(): void {
    this.emitter.emit = true;
  }

  public stop(): void {
    this.emitter.emit = false;
  }

  public update(ticker: Ticker): void {
    this.emitter.update(ticker.deltaMS * 0.001);
  }

  private getEmitterConfig(): EmitterConfigV3 {
    const textureIDs = [
      "coin-anim-01.png",
      "coin-anim-02.png",
      "coin-anim-03.png",
      "coin-anim-04.png",
      "coin-anim-05.png",
      "coin-anim-06.png",
    ];
    const textures = textureIDs.map((id) => this.assetManager.getAsset(id));
    return {
      lifetime: {
        min: 11,
        max: 11,
      },
      frequency: 0.1,
      emitterLifetime: 0,
      maxParticles: 1000,
      addAtBack: false,
      pos: {
        x: 0,
        y: 0,
      },
      behaviors: [
        {
          type: "alpha",
          config: {
            alpha: {
              list: [
                {
                  time: 0,
                  value: 0,
                },
                {
                  time: 0.01,
                  value: 1,
                },
                {
                  time: 0.95,
                  value: 1,
                },
                {
                  time: 1,
                  value: 0,
                },
              ],
            },
          },
        },
        {
          type: "moveAcceleration",
          config: {
            accel: {
              x: 0,
              y: 800,
            },
            minStart: 800,
            maxStart: 1200,
            rotate: true,
          },
        },
        {
          type: "scale",
          config: {
            scale: {
              list: [
                {
                  time: 0,
                  value: 0.5,
                },
                {
                  time: 1,
                  value: 1,
                },
              ],
            },
            minMult: 1,
          },
        },
        {
          type: "rotationStatic",
          config: {
            min: 260,
            max: 280,
          },
        },
        {
          type: "animatedSingle",
          config: {
            anim: {
              textures: textures,
              framerate: 24,
              loop: true,
            },
          },
        },
        {
          type: "spawnShape",
          config: {
            type: "rect",
            data: {
              x: -100,
              y: 0,
              w: 200,
              h: 5,
            },
          },
        },
      ],
    };
  }
}
