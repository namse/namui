export interface IRecord {
  getResult(id: number):
    | {
        audioBlob: Blob;
        samples: Float32Array;
      }
    | undefined;
  fillAudioWaveFormBuffer(id: number, buffer: Uint8Array): void;
  isInitializingError(id: number): boolean;
  stopRecord(id: number): void;
  isInitializingDone(id: number): boolean;
  startInitializeRecord(id: number): void;
  startRecord(id: number): void;
}
