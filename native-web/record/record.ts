import { IRecord } from "../../native/Record";

type RecordState = {
  mediaRecorder?: MediaRecorder;
  analyserNode?: AnalyserNode;
  isInitializingError: boolean;
  chunks: Blob[];
  recordResult?: {
    samples: Float32Array;
  };
};

export class Record implements IRecord {
  private readonly recordingStates: {
    [id: number]: RecordState;
  } = {};

  startInitializeRecord(id: number): void {
    const state: RecordState = {
      isInitializingError: false,
      chunks: [],
    };

    if (this.recordingStates[id]?.mediaRecorder?.state === "recording") {
      this.recordingStates[id].mediaRecorder?.stop();
    }

    this.recordingStates[id] = state;

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        state.mediaRecorder = mediaRecorder;
        mediaRecorder.ondataavailable = (event) => {
          state.chunks.push(event.data);
        };
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        state.analyserNode = analyser;
        source.connect(analyser);
      })
      .catch((error) => {
        console.error(error);
        this.recordingStates[id].isInitializingError = true;
      });
  }
  startRecord(id: number): void {
    this.recordingStates[id].mediaRecorder?.start(1000);
  }
  stopRecord(id: number): void {
    const state = this.recordingStates[id];
    const { mediaRecorder, chunks } = state;
    if (!mediaRecorder) {
      throw new Error("cannot find mediaRecorder");
    }
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      const audioContext = new AudioContext();
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
  fillAudioWaveFormBuffer(id: number, buffer: Uint8Array) {
    const { analyserNode } = this.recordingStates[id];
    if (!analyserNode) {
      throw new Error("cannot find analyserNode");
    }
    analyserNode.getByteTimeDomainData(buffer);
  }
  getResult(id: number): { samples: Float32Array } | undefined {
    return this.recordingStates[id]?.recordResult;
  }
}

export const record = new Record();
