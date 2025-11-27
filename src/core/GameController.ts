import EventEmitter from "eventemitter3";
import { DataStore, GameEvent } from ".";
import { MockBackend } from "./MockBackend";

export class GameController {
  private readonly events: EventEmitter<GameEvent>;
  private readonly dataStore: DataStore;
  private mockBackend: MockBackend;
  constructor(eventEmitter: EventEmitter<GameEvent>, dataStore: DataStore) {
    this.events = eventEmitter;
    this.dataStore = dataStore;
    this.mockBackend = new MockBackend();
  }

  public showSplashScreen() {
    this.events.emit(GameEvent.SHOW_TITLE_SCREEN);
  }

  public showGameScreen() {
    this.events.emit(GameEvent.SHOW_GAME_SCREEN);
  }

  public notifySpinComplete() {
    this.events.emit(GameEvent.SPIN_COMPLETE);
    if (this.dataStore.result !== null) {
      this.events.emit(GameEvent.SHOW_WIN, this.dataStore.result);
    }
  }

  public notifyWinComplete() {
    this.events.emit(GameEvent.SHOW_WIN_COMPLETE);
  }

  public async requestGameData(): Promise<void> {
    const result = this.mockBackend.getGameData();
    this.dataStore.setGameData(result);
    this.events.emit(GameEvent.GAME_DATA_RECEIVED, result);
  }

  public requestSpin() {
    this.events.emit(GameEvent.SPIN_REQUESTED);
    const result = this.mockBackend.getSpinResult(); // In a real app this would be async
    this.dataStore.setResult(result);
    this.events.emit(GameEvent.SPIN_RESULT_RECEIVED, result);
  }
}
