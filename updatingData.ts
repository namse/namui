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
  playButtonId: number;
  state: "idle" | "initializing" | "recording" | "finishing";
  realtimeAudioWaveFormId?: number;
  realtimeAudioBuffer: Uint8Array;
  fullAudioWaveFormId?: number;
  fullAudioBuffer?: Float32Array;
  playId?: number;
};

export type MapRecordingStateToButtonText = {
  type: "mapRecordingStateToButtonText";
  id: number;
  buttonId: number;
  updatingId: number;
};

export type UpdatingData =
  | Rotation
  | AddAfterClick<Rotation>
  | Move
  | RecordOnClick
  | MapRecordingStateToButtonText;

export type UpdatingDataList = Array<UpdatingData>;
export type UpdatingDataMap = { [id: number]: UpdatingData };

export const updatingDataList: UpdatingDataList = [
  {
    type: "recordOnClick",
    id: 0,
    recordButtonId: 0,
    playButtonId: 4,
    state: "idle",
    realtimeAudioWaveFormId: 2,
    realtimeAudioBuffer: new Uint8Array(1024),
    fullAudioWaveFormId: 3,
  },
  {
    type: "mapRecordingStateToButtonText",
    id: 1,
    buttonId: 0,
    updatingId: 0,
  },
];
