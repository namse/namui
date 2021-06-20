import { IAudioPlayer } from "../native/AudioPlayer";

type AudioPlayingContext = {
  isPlaying: boolean;
  stop: () => void;
};

class AudioPlayer implements IAudioPlayer {
  private static nextPlayId: number = 1;
  private readonly playingContexts: { [playId: number]: AudioPlayingContext } =
    {};
  play(url: string): { playId: number } {
    const audio = new Audio(url);
    const playingContext = {
      isPlaying: false,
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
    const playingContext = {
      isPlaying: false,
      stop: () => {
        source.stop();
      },
    };
    source.onended = () => {
      console.log("ended");
      playingContext.isPlaying = false;
    };
    context.onstatechange = (event) => {
      console.log(event);
    };
    source.start();
    playingContext.isPlaying = true;

    const playId = AudioPlayer.nextPlayId++;
    this.playingContexts[playId] = playingContext;

    return {
      playId,
    };
  }
  isPlayFinished(playId: number): boolean {
    const audio = this.playingContexts[playId];
    return !audio || audio.isPlaying;
  }
  clearAudio(playId: number): void {
    delete this.playingContexts[playId];
  }
}

export const audioPlayer = new AudioPlayer();
