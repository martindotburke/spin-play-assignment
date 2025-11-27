import { GameData } from "./MockBackend";

export class DataStore {    
    private _gameData: GameData | null = null;

    public get gameData(): GameData | null {
        return this._gameData;
    }

    public setGameData(data: GameData | null) {
        this._gameData = data;
    }
}