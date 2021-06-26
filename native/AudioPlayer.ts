export interface IAudioPlayer {
  clearAudio(playId: number): void;
  isPlayFinished(playId: number): boolean;
  playUrl(url: string): { playId: number };
  playSamples(samples: Float32Array): { playId: number };
  getPlaybackTimeRate(playId: number): number;
}
