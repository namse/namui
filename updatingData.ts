export type WithTarget = {
  targetId: number;
};

export type Rotation = {
  type: "rotation";
  targetId: number;
  angularVelocity: number;
  anchor: {
    x: number;
    y: number;
  };
};

export type AddAfterClick<T extends WithTarget> = {
  type: "addAfterClick";
  targetId: number;
  value: T;
  once: boolean;
};

export type Move = {
  type: "move";
  targetId: number;
  velocity: {
    x: number;
    y: number;
  };
};

export type StartRecordOnClick = {
  type: "startRecordOnClick";
  buttonId: number;
};

export type MapRecordingStateToButtonText = {
  type: "mapRecordingStateToButtonText";
  buttonId: number;
};

export type UpdatingData =
  | Rotation
  | AddAfterClick<Rotation>
  | Move
  | StartRecordOnClick
  | MapRecordingStateToButtonText;

export type UpdatingDataList = Array<UpdatingData>;

export const updatingDataList: UpdatingDataList = [
  {
    type: "startRecordOnClick",
    buttonId: 0,
  },
  {
    type: "mapRecordingStateToButtonText",
    buttonId: 0,
  },
];
