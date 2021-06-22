export interface IAudioNetwork {
  isSaveFinished(savingId: number): boolean;
  saveFloat32PcmAudio(
    float32PcmBuffer: Float32Array,
    filename: string
  ): { savingId: any };
}
