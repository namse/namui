import {
  AudioChunkWaveform,
  AudioWaveformEditor,
  AudioWaveformPlayer,
  Button,
  Circle,
  Float32AudioWaveform,
  Float32AudioWaveformPlayer,
  RenderingDataList,
  Text,
  TextBox,
  Uint8AudioWaveform,
} from "./renderingData";

export function render(
  context: CanvasRenderingContext2D,
  dataList: RenderingDataList
) {
  dataList.forEach((data) => {
    context.save();
    switch (data.type) {
      case "circle":
        {
          renderCircle(context, data);
        }
        break;
      case "text":
        {
          renderText(context, data);
        }
        break;
      case "button":
        {
          renderButton(context, data);
        }
        break;
      case "uint8AudioWaveform":
        {
          renderUint8AudioWaveform(context, data);
        }
        break;
      case "float32AudioWaveform":
        {
          renderFloat32AudioWaveformBox(context, data);
        }
        break;
      case "audioWaveformEditor":
        {
          renderAudioWaveformEditor(context, data);
        }
        break;
      case "float32AudioWaveformPlayer":
        {
          renderFloat32AudioWaveformPlayer(context, data);
        }
        break;
      case "textBox":
        {
          renderTextBox(context, data);
        }
        break;
      case "audioWaveformPlayer":
        {
          renderAudioWaveformPlayer(context, data);
        }
        break;
      case "audioChunkWaveform":
        {
          renderAudioChunkWaveform(context, data);
        }
        break;
      default:
        {
          console.error(`unknown data`, data);
        }
        break;
    }
    context.restore();
  });
}

function renderCircle(context: CanvasRenderingContext2D, data: Circle): void {
  context.beginPath();
  context.ellipse(
    data.center.x,
    data.center.y,
    data.radius,
    data.radius,
    0,
    0,
    2 * Math.PI
  );
  context.closePath();
  context.fillStyle = `rgba(${data.color.r}, ${data.color.g}, ${data.color.b}, ${data.color.a})`;
  context.fill();
}

function renderText(
  context: CanvasRenderingContext2D,
  data: Omit<Text, "id" | "type">
) {
  context.textAlign = data.align;
  context.textBaseline = data.textBaseline;
  context.font = `${data.fontSize}px sans-serif`;
  context.fillStyle = `rgba(${data.color.r}, ${data.color.g}, ${data.color.b}, ${data.color.a})`;
  context.translate(+data.position.x, +data.position.y);
  context.rotate(data.rotationAngle);
  context.translate(-data.position.x, -data.position.y);
  context.fillText(data.content, data.position.x, data.position.y);
}

function renderButton(context: CanvasRenderingContext2D, data: Button) {
  if (data.isHidden) {
    return;
  }
  context.strokeStyle = "1px black";
  context.strokeRect(data.position.x, data.position.y, data.width, data.height);
  context.translate(data.position.x, data.position.y);
  renderText(context, data.text);
  context.translate(-data.position.x, -data.position.y);
}
function renderUint8AudioWaveform(
  context: CanvasRenderingContext2D,
  data: Uint8AudioWaveform
) {
  context.translate(data.position.x, data.position.y);

  context.fillStyle = "rgb(200, 200, 200)";
  context.fillRect(0, 0, data.width, data.height);

  context.lineWidth = 2;
  context.strokeStyle = "rgb(0, 0, 0)";

  context.beginPath();

  if (data.buffer.length < data.width) {
    const sliceWidth = data.width / data.buffer.length;
    for (let i = 0; i < data.buffer.length; i++) {
      const x = i * sliceWidth;
      const value = data.buffer[i] / 128.0;
      const y = (value * data.height) / 2;

      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
  } else {
    for (let x = 0; x < data.width; x += 1) {
      const index = Math.floor(data.buffer.length * (x / data.width));
      const value = data.buffer[index] / 128.0;
      const y = (value * data.height) / 2;
      if (x === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
  }

  context.lineTo(data.width, data.height / 2);
  context.stroke();

  context.translate(-data.position.x, -data.position.y);
}

function renderFloat32AudioWaveform(
  context: CanvasRenderingContext2D,
  data: Omit<Float32AudioWaveform, "id" | "type">
) {
  if (!data.buffer) {
    return;
  }
  context.translate(data.position.x, data.position.y);
  context.beginPath();

  if (data.buffer.length < data.width) {
    const sliceWidth = data.width / data.buffer.length;
    for (let i = 0; i < data.buffer.length; i++) {
      const x = i * sliceWidth;
      const value = data.buffer[i];
      const y = (data.height * (value + 1)) / 2;

      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
  } else {
    for (let x = 0; x < data.width; x += 1) {
      const index = Math.floor(data.buffer.length * (x / data.width));
      const value = data.buffer[index];
      const y = (data.height * (value + 1)) / 2;
      if (x === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
  }

  context.lineTo(data.width, data.height / 2);
  context.stroke();
  context.translate(-data.position.x, -data.position.y);
}

function renderFloat32AudioWaveformBox(
  context: CanvasRenderingContext2D,
  data: Omit<Float32AudioWaveform, "id" | "type">
) {
  context.translate(data.position.x, data.position.y);

  context.fillStyle = "rgb(200, 200, 200)";
  context.fillRect(0, 0, data.width, data.height);

  context.lineWidth = 2;
  context.strokeStyle = "rgb(0, 0, 0)";
  context.translate(-data.position.x, -data.position.y);

  renderFloat32AudioWaveform(context, data);
}
function renderAudioWaveformEditor(
  context: CanvasRenderingContext2D,
  data: AudioWaveformEditor
) {
  if (data.isHidden) {
    return;
  }
  renderFloat32AudioWaveformBox(context, data);

  context.translate(data.position.x, data.position.y);

  if (data.highlightOn === "start") {
    context.fillStyle = "rgb(255, 0, 0)";
  } else {
    context.fillStyle = "rgb(128, 0, 0)";
  }

  context.fillRect(
    (data.width * data.startBarPercent) / 100 - data.barWidth / 2,
    0,
    data.barWidth,
    data.height
  );

  if (data.highlightOn === "end") {
    context.fillStyle = "rgb(255, 0, 0)";
  } else {
    context.fillStyle = "rgb(128, 0, 0)";
  }

  context.fillRect(
    (data.width * data.endBarPercent) / 100 - data.barWidth / 2,
    0,
    data.barWidth,
    data.height
  );

  context.translate(-data.position.x, -data.position.y);
}
function renderFloat32AudioWaveformPlayer(
  context: CanvasRenderingContext2D,
  data: Float32AudioWaveformPlayer
) {
  renderFloat32AudioWaveformBox(context, data);
  context.translate(data.position.x, data.position.y);

  const barX = data.width * data.playBarXRatio - data.playBarWidth / 2;

  context.fillStyle = "black";
  context.fillRect(barX, 0, data.playBarWidth, data.height);

  context.translate(-data.position.x, -data.position.y);
}
function getOneLineFitTextInfo(
  context: CanvasRenderingContext2D,
  text: string,
  boxWidth: number
): {
  textLength: number;
} {
  if (context.measureText(text).width <= boxWidth) {
    return {
      textLength: text.length,
    };
  }

  let left = 0;
  let right = text.length - 1;
  while (left < right) {
    const mid = Math.ceil((left + right) / 2);
    const substring = text.substring(0, mid);
    if (context.measureText(substring).width > boxWidth) {
      right = mid - 1;
    } else {
      left = mid;
    }
  }

  // Debug
  if (context.measureText(text.substring(0, left)).width > boxWidth) {
    console.log(text, left, right);
  }

  return {
    textLength: left,
  };
}
function renderTextBox(context: CanvasRenderingContext2D, data: TextBox) {
  context.save();
  context.translate(data.position.x, data.position.y);

  context.strokeStyle = `rgba(${data.borderColor.r}, ${data.borderColor.g}, ${data.borderColor.b}, ${data.borderColor.a})`;
  context.strokeRect(0, 0, data.width, data.height);

  context.beginPath();
  context.rect(0, 0, data.width, data.height);
  context.clip();

  context.font = `${data.fontSize}px sans-serif`;
  context.fillStyle = `rgba(${data.textColor.r}, ${data.textColor.g}, ${data.textColor.b}, ${data.textColor.a})`;
  context.textAlign = data.align;
  context.textBaseline = data.textBaseline;

  const lineFedTexts = data.content.split("\n");
  let lineIndex = 0;
  let lineFedTextIndex = 0;
  let text = lineFedTexts[lineFedTextIndex];

  while (lineFedTextIndex < lineFedTexts.length) {
    const { textLength } = getOneLineFitTextInfo(context, text, data.width);
    context.fillText(
      text.substring(0, textLength),
      0,
      lineIndex * data.fontSize
    );
    lineIndex += 1;
    if (lineIndex * data.fontSize > data.height) {
      break;
    }
    if (text.length === textLength) {
      // next line
      text = lineFedTexts[++lineFedTextIndex];
    } else {
      text = text.substring(textLength);
    }
  }

  context.restore();
}
function renderAudioWaveformPlayer(
  context: CanvasRenderingContext2D,
  data: AudioWaveformPlayer
) {
  if (data.isHidden) {
    return;
  }
  renderFloat32AudioWaveformBox(context, {
    ...data,
    buffer: data.buffer?.channelDataList[0],
  });

  context.translate(data.position.x, data.position.y);

  const barX = data.width * data.playBarXRatio - data.playBarWidth / 2;

  context.fillStyle = "black";
  context.fillRect(barX, 0, data.playBarWidth, data.height);

  context.translate(-data.position.x, -data.position.y);
}
function renderAudioChunkWaveform(
  context: CanvasRenderingContext2D,
  data: AudioChunkWaveform
) {
  if (data.isHidden) {
    return;
  }
  context.translate(data.position.x, data.position.y);

  context.fillStyle = "rgb(200, 200, 200)";
  context.fillRect(0, 0, data.width, data.height);

  context.lineWidth = 2;
  context.strokeStyle = "rgb(0, 0, 0)";
  context.translate(-data.position.x, -data.position.y);

  const { buffer } = data;
  if (buffer && buffer.channelChunkDataList[0]) {
    const bufferLength = buffer.channelChunkDataList[0].length;
    const cap = 4 * 60;
    const length = Math.ceil(bufferLength / cap) * cap;
    const width = data.width / length;
    buffer.channelChunkDataList[0].forEach((chunkData, index) => {
      renderFloat32AudioWaveform(context, {
        ...data,
        width,
        position: {
          x: data.position.x + index * width,
          y: data.position.y,
        },
        buffer: chunkData,
      });
    });
  }
}
