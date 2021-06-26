import { CommonAudioBuffer } from "../common/AudioBuffer";

export interface IAudioDownloader {
  startDownloadAudio(filename: string): { downloadingId: number };
  isDownloadDone(downloadingId: number): boolean;
  isDownloadError(downloadingId: number): boolean;
  getDownloadedAudio(downloadingId: number): CommonAudioBuffer;
}
