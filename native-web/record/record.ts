import { IRecord } from "../../native/Record";

type RecordState = {
  mediaRecorder?: MediaRecorder;
  isInitializingError: boolean;
  chunks: Blob[];
  recordResult?: {
    samples: Float32Array;
  };
};

class Record implements IRecord {
  private readonly recordingStates: {
    [id: number]: RecordState;
  } = {};

  private static sharedAudio?: {
    audioContext: AudioContext;
    audioStream: MediaStream;
    analyser: AnalyserNode;
  };

  async startInitializeRecord(id: number): Promise<void> {
    try {
      const previousState = this.recordingStates[id];
      if (previousState) {
        if (previousState.mediaRecorder?.state === "recording") {
          previousState.mediaRecorder?.stop();
        }
      }

      const state: RecordState = {
        isInitializingError: false,
        chunks: [],
      };
      this.recordingStates[id] = state;

      if (!Record.sharedAudio) {
        const audioContext = new AudioContext();
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const source = audioContext.createMediaStreamSource(audioStream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        Record.sharedAudio = {
          audioContext,
          audioStream,
          analyser,
        };
      }
      const { audioStream } = Record.sharedAudio;
      const mediaRecorder = new MediaRecorder(audioStream);
      state.mediaRecorder = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        state.chunks.push(event.data);
      };
    } catch {
      this.recordingStates[id].isInitializingError = true;
    }
  }
  startRecord(id: number): void {
    this.recordingStates[id].mediaRecorder?.start(1000);
  }
  stopRecord(id: number): void {
    if (!Record.sharedAudio) {
      throw new Error("sharedAudio not initialized");
    }
    const { audioContext } = Record.sharedAudio;
    const state = this.recordingStates[id];
    const { mediaRecorder, chunks } = state;
    if (!mediaRecorder) {
      throw new Error("cannot find mediaRecorder");
    }
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const samples = audioBuffer.getChannelData(0);
      state.recordResult = { samples };
    };
    mediaRecorder.stop();
  }
  isInitializingDone(id: number): boolean {
    return !!this.recordingStates[id].mediaRecorder;
  }
  isInitializingError(id: number): boolean {
    if (!this.recordingStates[id]) {
      return true;
    }
    return !!this.recordingStates[id].isInitializingError;
  }
  fillAudioWaveformBuffer(id: number, buffer: Uint8Array) {
    if (!Record.sharedAudio) {
      throw new Error("sharedAudio not initialized");
    }
    const { analyser } = Record.sharedAudio;
    analyser.getByteTimeDomainData(buffer);
  }
  getResult(id: number): { samples: Float32Array } | undefined {
    return this.recordingStates[id]?.recordResult;
  }
}

export const record = new Record();
