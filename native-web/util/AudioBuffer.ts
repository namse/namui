import { CommonAudioBuffer } from "../../common/AudioBuffer";

export function toCommonAudioBuffer(
  audioBuffer: AudioBuffer
): CommonAudioBuffer {
  const channelDataList: Float32Array[] = [];
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel += 1) {
    channelDataList.push(audioBuffer.getChannelData(channel));
  }

  return {
    duration: audioBuffer.duration,
    length: audioBuffer.length,
    numberOfChannels: audioBuffer.numberOfChannels,
    sampleRate: audioBuffer.sampleRate,
    channelDataList,
  };
}
