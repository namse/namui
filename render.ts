import { Circle, DataList, Text } from "./data";

export function render(context: CanvasRenderingContext2D, dataList: DataList) {
    dataList.forEach(data => {
        switch (data.type) {
            case "circle": {
                renderCircle(context, data);
                return;
            }
            case 'text': {
                renderText(context, data);
                return;
            }
            default: {
                console.error(`unknown data ${data}`);
                return;
            }
        }
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
        2 * Math.PI);
    context.closePath();
    context.fillStyle = `rgba(${data.color.r}, ${data.color.g}, ${data.color.b}, ${data.color.a})`;
    context.fill();
}

function renderText(context: CanvasRenderingContext2D, data: Text) {
    context.textAlign = data.align,
    context.font = `${data.fontSize}px`;
    context.fillStyle = `rgba(${data.color.r}, ${data.color.g}, ${data.color.b}, ${data.color.a})`;
    context.fillText(data.content, data.position.x, data.position.y);
}
