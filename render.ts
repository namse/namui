import {
  Button,
  Circle,
  Float32AudioWaveform,
  RenderingDataList,
  Text,
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
          renderFloat32AudioWaveform(context, data);
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

function renderText(context: CanvasRenderingContext2D, data: Text) {
  context.textAlign = data.align;
  context.textBaseline = data.textBaseline;
  context.font = `${data.fontSize}px`;
  context.fillStyle = `rgba(${data.color.r}, ${data.color.g}, ${data.color.b}, ${data.color.a})`;
  context.translate(+data.position.x, +data.position.y);
  context.rotate(data.rotationAngle);
  context.translate(-data.position.x, -data.position.y);
  context.fillText(data.content, data.position.x, data.position.y);
}

function renderButton(context: CanvasRenderingContext2D, data: Button) {
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

  const sliceWidth = data.width / data.buffer.length;

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
  data: Float32AudioWaveform
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
