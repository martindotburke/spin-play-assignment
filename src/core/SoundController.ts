import { AssetManager } from "./AssetManager";

export class SoundController {
  private assetManager: AssetManager;
  private creditsRollupSound: Howl | null = null;

  constructor(assetManager: AssetManager) {
    this.assetManager = assetManager;
  }

  public playSound(id: string): Howl {
    const sound = this.assetManager.getSound(id);
    if (sound) {
      sound.play();
      return sound;
    } else {
      console.warn(`Sound with id ${id} not found.`);
    }
    return sound;
  }

  public playClickSound(): void {
    this.playSound("wheel-click.wav");
  }

  public playLandSound(): void {
    this.playSound("wheel-landing.wav");
  }

  public playCreditsRollup(): void {
    this.creditsRollupSound = this.playSound("credits-rollup.wav").loop(
      true,
    ) as Howl;
  }

  public stopCreditsRollup(): void {
    if (this.creditsRollupSound) {
      this.creditsRollupSound.stop();
      this.creditsRollupSound = null;
    }
  }
}
