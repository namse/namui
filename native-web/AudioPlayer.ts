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
  playSamples(samples: Float32Array): { playId: number } {
    const context = new AudioContext();
    const source = context.createBufferSource();
    const buffer = context.createBuffer(1, samples.length, context.sampleRate);
    buffer.copyToChannel(samples, 0);
    source.buffer = buffer;
    source.connect(context.destination);
    let startTimeSecond: number = 0;
    const playingContext: AudioPlayingContext = {
      isPlaying: false,
      durationSecond: buffer.duration,
      getPlaytimeSecond: () => {
        return context.currentTime - startTimeSecond;
      },
      stop: () => {
        source.stop();
      },
    };
    source.onended = () => {
      playingContext.isPlaying = false;
    };
    source.start();
    startTimeSecond = context.currentTime;
    playingContext.isPlaying = true;

    const playId = AudioPlayer.nextPlayId++;
    this.playingContexts[playId] = playingContext;

    return {
      playId,
    };
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
}

export const audioPlayer = new AudioPlayer();
