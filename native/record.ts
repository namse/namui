export interface IRecord {
  fillAudioWaveFormBuffer(id: number, buffer: Uint8Array): void;
  isInitializingError(id: number): boolean;
  stopRecord(id: number): void;
  isInitializingDone(id: number): boolean;
  startInitializeRecord(id: number): void;
  startRecord(id: number): void;
}
