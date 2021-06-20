import { IRecord } from "../native/record";

class Record implements IRecord {
  private readonly recordingStates: {
    [id: number]: {
      mediaRecorder?: MediaRecorder;
      analyserNode?: AnalyserNode;
      isInitializingError: boolean;
    };
  } = {};
  startInitializeRecord(id: number): void {
    this.recordingStates[id] = {
      isInitializingError: false,
    };

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        this.recordingStates[id].mediaRecorder = new MediaRecorder(stream);
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        this.recordingStates[id].analyserNode = analyser;
        source.connect(analyser);
      })
      .catch((error) => {
        console.error(error);
        this.recordingStates[id].isInitializingError = true;
      });
  }
  startRecord(id: number): void {
    this.recordingStates[id].mediaRecorder.start(1000);
  }
  stopRecord(id: number): void {
    this.recordingStates[id].mediaRecorder.stop();
  }
  isInitializingDone(id: number): boolean {
    return !!this.recordingStates[id].mediaRecorder;
  }
  isInitializingError(id: number): boolean {
    return !!this.recordingStates[id].isInitializingError;
  }
  fillAudioWaveFormBuffer(id: number, buffer: Uint8Array) {
    const { analyserNode } = this.recordingStates[id];
    if (!analyserNode) {
      throw new Error("cannot find analyserNode");
    }
    analyserNode.getByteTimeDomainData(buffer);
  }
}

export const record = new Record();
