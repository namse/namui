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

export type Audio = {
  type: "audio";
  id: number;
  filePath: string;
  volume: number;
  isPlaying: boolean;
};

export type AudioWaveForm = {
  type: "audioWaveForm";
  id: number;
  buffer: Uint8Array;
  width: number;
  height: number;
  position: {
    x: number;
    y: number;
  };
};

export type RenderingData = Circle | Text | Button | AudioWaveForm;
export type RenderingDataList = Array<RenderingData>;
export type RenderingDataMap = { [id: number]: RenderingData };

export const renderingDataList: RenderingDataList = [
  {
    type: "button",
    id: 0,
    width: 40,
    height: 20,
    position: {
      x: 300,
      y: 100,
    },
    text: {
      type: "text",
      id: 1,
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
  {
    type: "audioWaveForm",
    id: 2,
    buffer: new Uint8Array(1024),
    width: 300,
    height: 100,
    position: {
      x: 0,
      y: 0,
    },
  },
];
