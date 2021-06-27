import {
  CommonAudioBuffer,
  CommonAudioChunkBuffer,
} from "./common/AudioBuffer";

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
  isHidden: boolean;
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  text: Omit<Text, "id" | "type">;
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

export type AudioWaveformPlayer = {
  type: "audioWaveformPlayer";
  id: number;
  isHidden: boolean;
  buffer?: CommonAudioBuffer;
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
  isHidden: boolean;
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

export type AudioChunkWaveform = {
  type: "audioChunkWaveform";
  id: number;
  isHidden: boolean;
  buffer?: CommonAudioChunkBuffer;
  width: number;
  height: number;
  position: {
    x: number;
    y: number;
  };
};

export type TextBox = {
  type: "textBox";
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
  width: number;
  height: number;
  fontSize: number;
  content: string;
  textColor: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  borderColor: {
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
  | TextBox
  | AudioWaveformPlayer
  | AudioChunkWaveform;

export type RenderingDataList = Array<RenderingData>;
export type RenderingDataMap = { [id: number]: RenderingData };

export const renderingDataList: RenderingDataList = [
  {
    type: "textBox",
    id: 9,
    align: "left",
    textBaseline: "hanging",
    content: "",
    fontSize: 20,
    position: {
      x: 500,
      y: 25,
    },
    width: 920,
    height: 200,
    textColor: {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    },
    borderColor: {
      r: 1,
      g: 1,
      b: 1,
      a: 0,
    },
  },
  {
    type: "button",
    id: 10,
    isHidden: false,
    width: 90,
    height: 60,
    position: {
      x: 500,
      y: 725,
    },
    text: {
      align: "center",
      textBaseline: "middle",
      content: "< prev",
      fontSize: 20,
      position: {
        x: 45,
        y: 30,
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
    type: "button",
    id: 11,
    isHidden: false,
    width: 90,
    height: 60,
    position: {
      x: 1920 - 500 - 90,
      y: 725,
    },
    text: {
      align: "center",
      textBaseline: "middle",
      content: "next >",
      fontSize: 20,
      position: {
        x: 45,
        y: 30,
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
    type: "button",
    id: 12,
    isHidden: false,
    width: 90,
    height: 60,
    position: {
      x: 1920 - 500 - 90,
      y: 625,
    },
    text: {
      align: "center",
      textBaseline: "middle",
      content: "play audio",
      fontSize: 16,
      position: {
        x: 45,
        y: 30,
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
    type: "button",
    id: 13,
    isHidden: false,
    width: 90,
    height: 60,
    position: {
      x: 1920 - 500 - 90,
      y: 425,
    },
    text: {
      align: "center",
      textBaseline: "middle",
      content: "record",
      fontSize: 16,
      position: {
        x: 45,
        y: 30,
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
    type: "audioWaveformPlayer",
    isHidden: true,
    id: 14,
    width: 800,
    height: 60,
    position: {
      x: 500,
      y: 625,
    },
    playBarWidth: 5,
    playBarXRatio: 0,
  },
  {
    type: "audioWaveformEditor",
    id: 15,
    isHidden: true,
    width: 800,
    height: 60,
    position: {
      x: 500,
      y: 425,
    },
    barWidth: 10,
    endBarPercent: 100,
    startBarPercent: 0,
    highlightOn: "nothing",
  },
  {
    type: "audioChunkWaveform",
    id: 16,
    isHidden: true,
    width: 800,
    height: 60,
    position: {
      x: 500,
      y: 425,
    },
  },
  {
    type: "button",
    id: 17,
    isHidden: true,
    width: 90,
    height: 60,
    position: {
      x: 1920 - 500 - 90,
      y: 525,
    },
    text: {
      align: "center",
      textBaseline: "middle",
      content: "save record",
      fontSize: 16,
      position: {
        x: 45,
        y: 30,
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
