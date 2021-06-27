import { CommonAudioBuffer } from "./common/AudioBuffer";

export type BaseUpdatingData = {
  type: "baseUpdatingData";
  id: number;
};

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
  controlAudioWaveformEditorId: number;
};

export type AudioWaveform = {
  type: "audioWaveform";
  id: number;
  float32AudioWaveformPlayerId: number;
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

export type ControlAudioWaveformEditor = {
  type: "controlAudioWaveformEditor";
  id: number;
  audioWaveformEditorId: number;
  audioWaveformId: number;
  sourceAudioBuffer?: Float32Array;
  draging?: {
    bar: "start" | "end";
    anchorX: number;
  };
};

export type ControlAudioWaveformEditorV2 = {
  isHidden: boolean;
  isNeedReset: boolean;
  audioWaveformEditorId: number;
  sourceAudioBuffer?: Float32Array;
  destAudioBuffer?: Float32Array;
  draging?: {
    bar: "start" | "end";
    anchorX: number;
  };
};

export type SaveAudioOnClickButton = {
  type: "saveAudioOnClickButton";
  id: number;
  buttonId: number;
  audioWaveformId: number;
  filename: string;
  isSaving: boolean;
  savingId?: number;
};

export type ViewScene = {
  type: "viewScene";
  id: number;
  textBoxId: number;
  sceneName: string;
  sceneLoadingState: "needStartLoading" | "loading" | "finished";
  sceneDataDownloadingId?: number;
  shotIndex: number;
  shotDataList: ShotData[];
  playAudioButtonId: number;
  nextButtonId: number;
  previousButtonId: number;
  audioBuffer?: CommonAudioBuffer;
  audioBufferDownloadingId?: number;
  isErrorOnAudioBufferDownloading?: boolean;
  recordButtonId: number;
  recordingState: "idle" | "initializing" | "recording" | "editing";
  recordingAudioChunkWaveformId: number;
  audioPlayerId: number;
  playId?: number;
  controlAudioWaveformEditorData: ControlAudioWaveformEditorV2;
  recordSaveButtonId: number;
  recordSavingId?: number;
};

export type ShotData = {
  id: string;
  text: string;
};

export type UpdatingData =
  | Rotation
  | AddAfterClick<Rotation>
  | Move
  | RecordOnClick
  | MapRecordingStateToButtonText
  | AudioWaveform
  | FpsText
  | ControlAudioWaveformEditor
  | SaveAudioOnClickButton
  | ViewScene
  | BaseUpdatingData;

export type UpdatingDataList = Array<UpdatingData>;
export type UpdatingDataMap = { [id: number]: UpdatingData };

export const updatingDataList: UpdatingDataList = [
  {
    type: "viewScene",
    id: 6,
    textBoxId: 9,
    previousButtonId: 10,
    nextButtonId: 11,
    playAudioButtonId: 12,
    recordButtonId: 13,
    audioPlayerId: 14,
    recordingState: "idle",
    recordingAudioChunkWaveformId: 16,
    controlAudioWaveformEditorData: {
      isHidden: true,
      isNeedReset: false,
      audioWaveformEditorId: 15,
    },
    recordSaveButtonId: 17,
    sceneName: "0주차",
    sceneLoadingState: "needStartLoading",
    shotDataList: [],
    shotIndex: 0,
  },
];
