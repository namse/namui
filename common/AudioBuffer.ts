export type CommonAudioBuffer = {
  duration: number;
  length: number;
  numberOfChannels: number;
  sampleRate: number;
  channelDataList: Float32Array[];
};

export type CommonAudioChunkBuffer = {
  numberOfChannels: number;
  sampleRate: number;
  channelChunkDataList: Float32Array[][];
};
