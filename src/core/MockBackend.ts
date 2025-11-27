import { GameData } from "./DataStore";

export class MockBackend {
  private readonly weightedResults = [
    [5000, 4],
    [200, 100],
    [1000, 20],
    [400, 50],
    [2000, 10],
    [200, 100],
    [1000, 20],
    [400, 50],
  ];
  private readonly playerStartingBalance = 10000;
  private forcedResult: number | null = null;

  constructor() {
    // Debugging
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      const keyAsNumber = parseInt(event.key);
      if (!isNaN(keyAsNumber)) {
        this.forcedResult = this.weightedResults[keyAsNumber]?.[0] || null;
        if (this.forcedResult !== null) {
          console.log(`Next spin result forced to ${this.forcedResult}`);
        }
      }
    });
  }

  private getRandomResult(): number {
    if (this.forcedResult !== null) {
      const result = this.forcedResult;
      this.forcedResult = null;
      return result;
    }

    const totalWeight = this.weightedResults.reduce(
      (sum, [, weight]) => sum + weight,
      0,
    );
    const rand = Math.random() * totalWeight;
    let cumulative = 0;
    for (const [value, weight] of this.weightedResults) {
      cumulative += weight;
      if (rand < cumulative) {
        return value;
      }
    }
    throw new Error("No value could be selected from the weighted table.");
  }

  getSpinResult(): number {
    // TODO - Send index along with value so we can land on the correct segment
    return this.getRandomResult();
  }

  getGameData(): GameData {
    return {
      segmentValues: this.weightedResults.map(([value, _]) => value),
      playerBalance: this.playerStartingBalance,
    };
  }
}
