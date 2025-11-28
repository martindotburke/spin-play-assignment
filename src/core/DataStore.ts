export type GameData = {
  segmentValues: number[];
  playerBalance: number;
};

// DataStore is responsible for managing the game state and player data.
export class DataStore {
  private _gameData: GameData | null = null;
  private _result: number | null = null;

  public get gameData(): GameData | null {
    return this._gameData;
  }

  public setGameData(data: GameData | null) {
    this._gameData = data;
  }

  public get result(): number | null {
    return this._result;
  }

  public setResult(result: number | null) {
    this._result = result;
  }
}
