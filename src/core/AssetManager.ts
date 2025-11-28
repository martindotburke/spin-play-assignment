import { Assets, Sprite } from "pixi.js";
import { Howl } from "howler";

/*
  TODO - We could make the manifest better by grouping assets as follows:
    - by type: Separeate images, audio, data etc so we can load only what is needed
    - by usage: e.g. loading screen assets, game screen assets, ui assets etc. We might want to load loading screen assets first, then game screen assets etc
    - by locale: e.g. en, fr, es etc so we can load translations, settings etc as required for the current locale
*/

export class AssetManager {
  private assetMap: Record<string, string> = {};
  private audioCache: Record<string, Howl> = {};

  public async loadAssets(): Promise<void> {
    await Assets.load("/assets/manifest.json");
    const manifest = Assets.get("/assets/manifest.json");
    this.assetMap = manifest as Record<string, string>;
    const allURLs = Object.values(this.assetMap);
    await Assets.load(allURLs);

    const audioPromises: Promise<void>[] = [];
    const audioURLs = allURLs.filter((url) => url.endsWith(".wav")); //TODO add other audio formats as needed
    audioURLs.forEach(async (url) => {
      audioPromises.push(
        new Promise((resolve) => {
          const sound = new Howl({
            src: [url],
            preload: true,
            onload: () => {
              this.audioCache[url] = sound;
              resolve();
            },
          });
        }),
      );
    });
    await Promise.all(audioPromises);
  }

  public getAsset<T>(id: string): T {
    if (this.assetMap[id]) {
      return Assets.get<T>(this.assetMap[id]);
    } else {
      return Assets.get<T>(id);
    }
  }

  public getSound(id: string): Howl {
    return this.audioCache[this.assetMap[id]];
  }

  public createSprite(textureId: string): Sprite {
    return new Sprite(Assets.get(this.assetMap[textureId]));
  }
}
