import { AssetManager } from "./AssetManager";
import { DataStore, GameController, GameEvent } from ".";
import EventEmitter from "eventemitter3";
import { Application } from "pixi.js";
import { GameSettings } from "./GameSettings";
import { SoundController } from "./SoundController";

// CoreUtils is a central utility class that provides access to core services
// such as asset management, event handling, game state management, and sound control.
export class CoreUtils {
  private readonly _assetManager: AssetManager;
  private readonly _gameController: GameController;
  private readonly _events: EventEmitter<GameEvent>;
  private readonly _app: Application;
  private readonly _dataStore: DataStore;
  private readonly _soundController: SoundController;

  constructor(app: Application) {
    this._app = app;
    this._assetManager = new AssetManager();
    this._soundController = new SoundController(this._assetManager);
    this._dataStore = new DataStore();
    this._events = new EventEmitter<GameEvent>();
    this._gameController = new GameController(this._events, this._dataStore);
  }

  public get assetManager(): AssetManager {
    return this._assetManager;
  }

  public get gameController(): GameController {
    return this._gameController;
  }

  public get events(): EventEmitter<GameEvent> {
    return this._events;
  }

  public get app(): Application {
    return this._app;
  }

  public get gameSettings(): GameSettings {
    return this._assetManager.getAsset<GameSettings>("settings-en.json");
  }

  public get dataStore(): DataStore {
    return this._dataStore;
  }

  public get soundController(): SoundController {
    return this._soundController;
  }
}
