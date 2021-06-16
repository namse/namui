export type Circle = {
  type: "circle";
  id: number;
  center: {
    x: number;
    y: number;
  };
  radius: number;
  color: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
};

export type Text = {
  type: "text";
  id: number;
  align: "left" | "center" | "right";
  position: {
    x: number;
    y: number;
  };
  fontSize: number;
  content: string;
  color: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  rotationAngle: number;
};

export type RenderingDataList = Array<Circle | Text>;
export type RenderingDataMap = { [id: number]: typeof renderingDataList[0] };

export const renderingDataList: RenderingDataList = [
  {
    type: "circle",
    id: 0,
    center: {
      x: 150,
      y: 150,
    },
    radius: 100,
    color: {
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    },
  },
  {
    type: "text",
    id: 1,
    align: "right",
    fontSize: 10,
    position: {
      x: 250,
      y: 150,
    },
    content: "hello world",
    color: {
      r: 0,
      g: 255,
      b: 0,
      a: 1,
    },
    rotationAngle: 0,
  },
];
