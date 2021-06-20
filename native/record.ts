export interface IRecord {
  isInitializingError(id: number): boolean;
  stopRecord(id: number): void;
  isInitializingDone(id: number): boolean;
  startInitializeRecord(id: number): void;
  startRecord(id: number): void;
}
