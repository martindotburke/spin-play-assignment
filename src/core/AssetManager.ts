import { Assets, Sprite } from "pixi.js";

export class AssetManager {
    private assetMap: Record<string, string> = {};

    public async loadAssets(): Promise<void> {

        //TODO - We could split assets into 2 bactches, loading screen followed by game assets

        await Assets.load("/assets/manifest.json");
        let manifest = Assets.get("/assets/manifest.json");
        this.assetMap = manifest as Record<string, string>;
        await Assets.load(Object.values(this.assetMap));
    }

    public getAsset<T>(id: string): T {
        return Assets.get<T>(this.assetMap[id]);
    }

    public createSprite(textureId: string): Sprite {
        return new Sprite(Assets.get(this.assetMap[textureId]));
    }
}   