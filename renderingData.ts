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
  text: Omit<Text, "id">;
};

export type Audio = {
  type: "audio";
  id: number;
  filePath: string;
  volume: number;
  isPlaying: boolean;
};

export type Uint8AudioWaveform = {
  type: "uint8AudioWaveform";
  id: number;
  buffer: Uint8Array;
  width: number;
  height: number;
  position: {
    x: number;
    y: number;
  };
};

export type Float32AudioWaveform = {
  type: "float32AudioWaveform";
  id: number;
  buffer?: Float32Array;
  width: number;
  height: number;
  position: {
    x: number;
    y: number;
  };
};

export type Float32AudioWaveformPlayer = {
  type: "float32AudioWaveformPlayer";
  id: number;
  buffer?: Float32Array;
  width: number;
  height: number;
  position: {
    x: number;
    y: number;
  };
  playBarXRatio: number;
  playBarWidth: number;
};

export type AudioWaveformEditor = {
  type: "audioWaveformEditor";
  id: number;
  buffer?: Float32Array;
  width: number;
  height: number;
  position: {
    x: number;
    y: number;
  };
  barWidth: number;
  startBarPercent: number;
  endBarPercent: number;
  highlightOn: "nothing" | "start" | "end";
};

export type TextBox = {
  type: "textBox";
  id: number;
  align: "left" | "center" | "right";
  textBaseline: "bottom" | "middle" | "top";
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  fontSize: number;
  content: string;
  color: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
};

export type RenderingData =
  | Circle
  | Text
  | Button
  | Uint8AudioWaveform
  | Float32AudioWaveform
  | AudioWaveformEditor
  | Float32AudioWaveformPlayer
  | TextBox;

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
    type: "uint8AudioWaveform",
    id: 2,
    buffer: new Uint8Array(1024),
    width: 300,
    height: 100,
    position: {
      x: 0,
      y: 0,
    },
  },
  {
    type: "float32AudioWaveformPlayer",
    id: 3,
    width: 300,
    height: 100,
    position: {
      x: 0,
      y: 100,
    },
    playBarWidth: 5,
    playBarXRatio: 0,
  },
  {
    type: "button",
    id: 4,
    width: 40,
    height: 20,
    position: {
      x: 300,
      y: 140,
    },
    text: {
      type: "text",
      align: "center",
      textBaseline: "middle",
      content: "play",
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
    type: "text",
    id: 6,
    align: "left",
    textBaseline: "top",
    content: "",
    fontSize: 10,
    position: {
      x: 0,
      y: 0,
    },
    color: {
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    },
    rotationAngle: 0,
  },
  {
    type: "audioWaveformEditor",
    id: 7,
    width: 300,
    height: 100,
    position: {
      x: 0,
      y: 200,
    },
    barWidth: 10,
    startBarPercent: 0,
    endBarPercent: 100,
    highlightOn: "nothing",
  },
  {
    type: "button",
    id: 8,
    width: 40,
    height: 20,
    position: {
      x: 300,
      y: 180,
    },
    text: {
      type: "text",
      align: "center",
      textBaseline: "middle",
      content: "save",
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
    type: "textBox",
    id: 9,
    align: "left",
    textBaseline: "top",
    content:
      "안녕하세요저는멀티라인이에요\n다들만나서\n\n반갑습니다요.\n there a way to set ",
    fontSize: 14,
    position: {
      x: 10,
      y: 500,
    },
    width: 100,
    height: 80,
    color: {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    },
  },
];
