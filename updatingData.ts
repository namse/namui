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
  sceneIndex: number;
  sceneDataList: SceneData[];
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

export type SceneData = {
  id: number;
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
    sceneIndex: 0,
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
    sceneDataList: [
      {
        id: 0,
        text: "아직은 머리위에 해가 떠다니는 오후 시간.",
      },
      {
        id: 1,
        text: "‘학생이라면 학교에서 공부를, 직장인이라면 직장에서 업무를’ 이라는 사회의 규칙속에서도 불구하고, 이곳. 모던한 분위기의 카페에서 양복을 빼입은 남자가 죽이면 안될 시간을 죽이고 있었다.",
      },
      {
        id: 2,
        text: "만약 그가 잠깐 시간을 떼우러 온것이라면 아무도 신경을 쓰지 않았을테지만, 남자가 얼마나 오래 있었는지 주부들이 이를 두고 한 두번 쑥덕거리기 까지 했다.",
      },
      {
        id: 3,
        text: "남자는 그것에 신경을 쓰지 않았다. 아니 사실 남자에겐 그런 여유가 없는 것 같았다.",
      },
    ],
  },
];
