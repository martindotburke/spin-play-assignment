import { CoreUtils, GameEvent } from "../../core";
import { WheelSettings } from "../../core/GameSettings";
import { BaseViewComponent } from "../BaseViewComponent";
import { Container, Sprite, Text } from "pixi.js";
import { gsap } from "gsap";

enum WheelState {
  IDLE,
  SPINNING,
  PULLBACK,
  BOUNCE,
}

export class WheelComponent extends BaseViewComponent {
  private settings: WheelSettings;
  private valueToRotationMap: Map<number, number> = new Map<number, number>();
  private segmentsContainer: Container = new Container();
  private isBusy: boolean = false;
  private pointer: Sprite;
  private pointerArc: number = 0;
  private state: WheelState = WheelState.IDLE;

  constructor(core: CoreUtils) {
    super(core);
    this.settings = this.core.gameSettings.wheel;
    this.pointer = this.assetManager.createSprite("pointer.png");

    this.events.addListener(GameEvent.GAME_DATA_RECEIVED, this.init.bind(this));
    this.events.addListener(
      GameEvent.SPIN_RESULT_RECEIVED,
      this.onSpinResultReceived.bind(this),
    );
  }

  private init(): void {
    this.addChild(this.segmentsContainer);

    // TODO - Resize source assets rather than scaling here
    this.scale.set(0.5, 0.5);

    const angle = (2 * Math.PI) / this.settings.segments;
    this.pointerArc = angle;
    const segmentValues = this.dataStore.gameData?.segmentValues || [];
    if (segmentValues.length != this.settings.segments) {
      throw new Error(
        `Segment values length ${segmentValues.length} does not match settings segments ${this.settings.segments}`,
      );
    }

    for (let i = 0; i < this.settings.segments; i++) {
      const rotation = i * angle;
      const segment = this.assetManager.createSprite("wheel-slice.png");
      segment.anchor.set(0.5, 1);
      segment.rotation = rotation;
      this.segmentsContainer.addChild(segment);

      const value = segmentValues[i];
      const valueText = new Text({
        text: "$" + value.toString(),
        style: {
          fill: "#ee0000",
          fontSize: 64,
          fontFamily: "Arial",
          dropShadow: {
            color: "#663333",
            blur: 4,
            distance: 4,
            angle: rotation,
          },
        },
      });
      valueText.pivot.set(-200, 30);
      valueText.rotation = rotation - Math.PI / 2;
      this.segmentsContainer.addChild(valueText);

      this.valueToRotationMap.set(value, -rotation);
    }

    const centre = this.assetManager.createSprite("wheel-center.png");
    centre.anchor.set(0.5, 0.5);
    this.addChild(centre);

    this.pointer.anchor.set(0.5, 0);
    this.pointer.y = -500;
    this.addChild(this.pointer);
  }

  private onSpinResultReceived(value: number): void {
    this.spinToValue(value);
  }

  private spinToValue(value: number): void {
    console.log(`Spinning to value: ${value}`);

    if (this.isBusy) {
      console.warn("Wheel is busy, cannot spin now.");
      return;
    }
    this.isBusy = true;

    const {
      rotationsPerSpin,
      spinDuration,
      pullbackDuration,
      pullbackDistance,
      landingBounceDuration,
      landingBounceDistance,
    } = this.settings;
    const spinTimeline = gsap.timeline();

    //normalise current rotation
    const currentRotation = this.segmentsContainer.rotation % (2 * Math.PI);
    this.segmentsContainer.rotation = currentRotation;

    //calculate target rotation
    const targetRotation = this.valueToRotationMap.get(value) as number;
    console.assert(
      targetRotation !== undefined,
      `No target rotation found for value ${value}`,
    );

    //pullback
    spinTimeline.to(this, {
      rotation: currentRotation - pullbackDistance,
      duration: pullbackDuration,
      ease: "power2.out",
      repeat: 1,
      yoyo: true,
      onStart: () => {
        this.state = WheelState.PULLBACK;
      },
    });

    //main spin
    const offset = Math.PI * 2 - currentRotation;
    const mainSpinTargetRotation =
      currentRotation + offset + (rotationsPerSpin / 2) * 2 * Math.PI;
    spinTimeline.to(this, {
      rotation: mainSpinTargetRotation,
      duration: spinDuration / 2,
      ease: "none",
      onStart: () => {
        this.state = WheelState.SPINNING;
      },
    });

    //landing
    const landingSpinTargetRotation =
      targetRotation +
      mainSpinTargetRotation +
      (rotationsPerSpin / 2) * 2 * Math.PI;
    spinTimeline.to(this, {
      rotation: landingSpinTargetRotation + landingBounceDistance,
      duration: spinDuration / 2,
      ease: "sine.out",
    });

    // final bounce
    spinTimeline.to(this, {
      rotation: landingSpinTargetRotation,
      duration: landingBounceDuration,
      ease: "elastic.out",
      onStart: () => {
        this.state = WheelState.BOUNCE;
      },
      onComplete: () => {
        this.state = WheelState.IDLE;
      },
    });

    spinTimeline.eventCallback("onComplete", this.onSpinComplete.bind(this));
  }

  public set rotation(value: number) {
    const previodusPointerRotation = this.pointer.rotation;
    const direction = value - this.segmentsContainer.rotation > 0 ? 1 : -1;
    if (direction == 1 && this.state == WheelState.SPINNING) {
      this.pointer.rotation = (value % this.pointerArc) * -1.5;

      if (this.pointer.rotation > previodusPointerRotation) {
        this.core.soundController.playClickSound();
      }
    } else {
      this.pointer.rotation = 0;
    }

    this.segmentsContainer.rotation = value;
  }

  public get rotation(): number {
    return this.segmentsContainer.rotation;
  }

  private onSpinComplete(): void {
    this.isBusy = false;
    this.gameController.notifySpinComplete();
    this.soundController.playLandSound();
  }
}
