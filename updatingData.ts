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

export type UpdatingData = Rotation | AddAfterClick<Rotation>;

export type UpdatingDataList = Array<UpdatingData>;

export const updatingDataList: UpdatingDataList = [
  {
    type: "addAfterClick",
    targetId: 2,
    value: {
      type: "rotation",
      targetId: 1,
      angularVelocity: (2 * Math.PI * 2) / 60 / 10,
      anchor: {
        x: 150,
        y: 150,
      },
    },
    once: true,
  },
];
