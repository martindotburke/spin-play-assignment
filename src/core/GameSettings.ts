export type GameSettings = {
  wheel: WheelSettings;
  readyText: string;
  spinningText: string;
  titleText: string;
  winText: string;
  bigWinThreshold: number;
  winCountUpDuration: number;
  bigWinCountUpDuration: number;
};

export type WheelSettings = {
  segments: number;
  rotationsPerSpin: number;
  spinDuration: number;
  pullbackDuration: number;
  pullbackDistance: number;
  landingBounceDuration: number;
  landingBounceDistance: number;
};
