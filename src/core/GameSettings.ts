export type GameSettings = {
    wheel: WheelSettings;
    readyText: string;
    spinningText: string;
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