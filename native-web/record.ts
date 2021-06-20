import { IRecord } from "../native/record";

class Record implements IRecord {
  private readonly recordingStates: {
    [id: number]: {
      mediaRecorder?: MediaRecorder;
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
      })
      .catch((error) => {
        console.error(error);
        this.recordingStates[id].isInitializingError = true;
      });
  }
  startRecord(id: number): void {
    this.recordingStates[id].mediaRecorder.start();
  }

  stopRecord(id: number): void {
    this.recordingStates[id].mediaRecorder.stop();
  }
  isInitializingDone(id: number): boolean {
    return !!(this.recordingStates[id].mediaRecorder);
  }
  isInitializingError(id: number): boolean {
    return !!(this.recordingStates[id].isInitializingError);
  }
}

export const record = new Record();
