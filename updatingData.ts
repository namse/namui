export type WithTarget = {
  targetId: number;
};

export type Rotation = {
  type: "rotation";
  id: number;
  targetId: number;
  angularVelocity: number;
  anchor: {
    x: number;
    y: number;
  };
};

export type AddAfterClick<T extends WithTarget> = {
  type: "addAfterClick";
  id: number;
  targetId: number;
  value: T;
  once: boolean;
};

export type Move = {
  type: "move";
  id: number;
  targetId: number;
  velocity: {
    x: number;
    y: number;
  };
};

export type RecordOnClick = {
  type: "recordOnClick";
  id: number;
  recordButtonId: number;
  state: "idle" | "initializing" | "recording" | "finishing";
  realtimeAudioWaveformId?: number;
  realtimeAudioBuffer: Uint8Array;
  audioWaveformId: number;
};

export type AudioWaveform = {
  type: "audioWaveform";
  id: number;
  audioWaveformId: number;
  audioBuffer?: Float32Array;
  playButtonId: number;
  playId?: number;
};

export type MapRecordingStateToButtonText = {
  type: "mapRecordingStateToButtonText";
  id: number;
  buttonId: number;
  updatingId: number;
};

export type FpsText = {
  type: "fpsText";
  id: number;
  textId: number;
};

export type UpdatingData =
  | Rotation
  | AddAfterClick<Rotation>
  | Move
  | RecordOnClick
  | MapRecordingStateToButtonText
  | AudioWaveform
  | FpsText;

export type UpdatingDataList = Array<UpdatingData>;
export type UpdatingDataMap = { [id: number]: UpdatingData };

export const updatingDataList: UpdatingDataList = [
  {
    type: "recordOnClick",
    id: 0,
    recordButtonId: 0,
    state: "idle",
    realtimeAudioWaveformId: 2,
    realtimeAudioBuffer: new Uint8Array(1024),
    audioWaveformId: 2,
  },
  {
    type: "mapRecordingStateToButtonText",
    id: 1,
    buttonId: 0,
    updatingId: 0,
  },
  {
    type: "audioWaveform",
    id: 2,
    audioWaveformId: 3,
    playButtonId: 4,
  },
  {
    type: "fpsText",
    id: 3,
    textId: 6,
  },
];
