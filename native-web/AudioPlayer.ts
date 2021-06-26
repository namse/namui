import { CommonAudioBuffer } from "../common/AudioBuffer";
import { IAudioPlayer } from "../native/AudioPlayer";

type AudioPlayingContext = {
  isPlaying: boolean;
  durationSecond: number;
  getPlaytimeSecond: () => number;
  stop: () => void;
};

class AudioPlayer implements IAudioPlayer {
  private static nextPlayId: number = 1;
  private readonly playingContexts: { [playId: number]: AudioPlayingContext } =
    {};
  playUrl(url: string): { playId: number } {
    const audio = new Audio(url);
    const playingContext: AudioPlayingContext = {
      isPlaying: false,
      durationSecond: audio.duration,
      getPlaytimeSecond: () => {
        return audio.currentTime;
      },
      stop: () => {
        audio.pause();
      },
    };
    audio.onended =
      audio.onpause =
      audio.oncancel =
        () => {
          playingContext.isPlaying = false;
        };
    audio.onplay = () => {
      playingContext.isPlaying = true;
    };
    audio.play();
    const playId = AudioPlayer.nextPlayId++;
    this.playingContexts[playId] = playingContext;
    return {
      playId,
    };
  }
  playWebAudioBuffer(
    audioContext: AudioContext,
    webAudioBuffer: AudioBuffer
  ): { playId: number } {
    const source = audioContext.createBufferSource();
    source.buffer = webAudioBuffer;
    source.connect(audioContext.destination);
    source.onended = () => {
      playingContext.isPlaying = false;
    };

    let startTimeSecond: number = 0;
    const playingContext: AudioPlayingContext = {
      isPlaying: false,
      durationSecond: webAudioBuffer.duration,
      getPlaytimeSecond: () => {
        return audioContext.currentTime - startTimeSecond;
      },
      stop: () => {
        source.stop();
      },
    };

    source.start();
    startTimeSecond = audioContext.currentTime;
    playingContext.isPlaying = true;

    const playId = AudioPlayer.nextPlayId++;
    this.playingContexts[playId] = playingContext;

    return {
      playId,
    };
  }
  playSamples(samples: Float32Array): { playId: number } {
    const audioContext = new AudioContext();

    const buffer = audioContext.createBuffer(
      1,
      samples.length,
      audioContext.sampleRate
    );
    buffer.copyToChannel(samples, 0);
    return this.playWebAudioBuffer(audioContext, buffer);
  }
  isPlayFinished(playId: number): boolean {
    const audio = this.playingContexts[playId];
    return !audio?.isPlaying;
  }
  clearAudio(playId: number): void {
    delete this.playingContexts[playId];
  }
  getPlaybackTimeRate(playId: number): number {
    const playingContext = this.playingContexts[playId];
    if (!playingContext) {
      throw new Error(`cannot get playingContext for playId ${playId}`);
    }
    return Math.max(
      0,
      Math.min(
        1,
        playingContext.getPlaytimeSecond() / playingContext.durationSecond
      )
    );
  }
  playAudioBuffer(audioBuffer: CommonAudioBuffer): { playId: number } {
    const audioContext = new AudioContext();
    const webAudioBuffer = new AudioBuffer({
      length: audioBuffer.length,
      sampleRate: audioBuffer.sampleRate,
      numberOfChannels: audioBuffer.numberOfChannels,
    });
    audioBuffer.channelDataList.forEach((channelData, index) => {
      webAudioBuffer.copyToChannel(channelData, index);
    });
    return this.playWebAudioBuffer(audioContext, webAudioBuffer);
  }
}

export const audioPlayer = new AudioPlayer();
