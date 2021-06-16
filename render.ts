import { Circle, RenderingDataList, Text } from "./renderingData";

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
      default:
        {
          console.error(`unknown data ${data}`);
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
  (context.textAlign = data.align), (context.font = `${data.fontSize}px`);
  context.fillStyle = `rgba(${data.color.r}, ${data.color.g}, ${data.color.b}, ${data.color.a})`;
  context.translate(+data.position.x, +data.position.y);
  context.rotate(data.rotationAngle);
  context.translate(-data.position.x, -data.position.y);
  context.fillText(data.content, data.position.x, data.position.y);
}
