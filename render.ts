import { Circle, DataList } from "./data";

export function render(context: CanvasRenderingContext2D, dataList: DataList) {
    dataList.forEach(data => {
        switch (data.type) {
            case "circle": {
                return renderCircle(context, data);
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
    context.fill();
}
