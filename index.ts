import { dataList } from "./data";
import { render } from "./render";

const canvas = document.createElement('canvas');
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);

const context = canvas.getContext('2d');

function onFrame() {
    render(context, dataList);
    requestAnimationFrame(onFrame);
}

requestAnimationFrame(onFrame);
