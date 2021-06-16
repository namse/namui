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
  textBaseline:
    | "alphabetic"
    | "bottom"
    | "hanging"
    | "ideographic"
    | "middle"
    | "top";
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

export type Button = {
  type: "button";
  id: number;
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  text: Text;
};

export type RenderingData = Circle | Text | Button;
export type RenderingDataList = Array<RenderingData>;
export type RenderingDataMap = { [id: number]: RenderingData };

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
    textBaseline: "middle",
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
  {
    type: "button",
    id: 2,
    width: 40,
    height: 20,
    position: {
      x: 300,
      y: 100,
    },
    text: {
      type: "text",
      id: 3,
      align: "center",
      textBaseline: "middle",
      content: "Start!",
      fontSize: 10,
      position: {
        x: 20,
        y: 10,
      },
      color: {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
      },
      rotationAngle: 0,
    },
  },
];
