export interface IRecord {
  getResult(id: number):
    | {
        samples: Float32Array;
      }
    | undefined;
  fillAudioWaveformBuffer(id: number, buffer: Uint8Array): void;
  isInitializingError(id: number): boolean;
  stopRecord(id: number): void;
  isInitializingDone(id: number): boolean;
  startInitializeRecord(id: number): void;
  startRecord(id: number): void;
}
