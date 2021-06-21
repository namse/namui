import {
  RenderingDataList,
  renderingDataList,
  RenderingDataMap,
} from "./renderingData";
import { render } from "./render";
import { MouseInfo, update, UpdateContext } from "./update";
import { updatingDataList } from "./updatingData";
import { stateData } from "./stateData";
import { Native } from "./native";
import { record } from "./native-web/record/Record";
import { audioPlayer } from "./native-web/AudioPlayer";

const canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);

const context = canvas.getContext("2d");
if (!context) {
  throw new Error("fail to get canvas 2d context");
}

function toMap<TItem extends { id: number }>(
  renderingDataList: TItem[]
): { [id: number]: TItem } {
  const map: { [id: number]: TItem } = {};
  renderingDataList.forEach((renderingData) => {
    map[renderingData.id] = renderingData;
  });
  return map;
}

let mouseInfo: MouseInfo | undefined;

canvas.addEventListener("mousemove", (event) => {
  mouseInfo = {
    isMouseDown: mouseInfo?.isMouseDown ?? false,
    position: {
      x: event.clientX,
      y: event.clientY,
    },
  };
});
canvas.addEventListener("mousedown", (event) => {
  mouseInfo = {
    isMouseDown: true,
    position: {
      x: event.clientX,
      y: event.clientY,
    },
  };
});
canvas.addEventListener("mouseup", (event) => {
  mouseInfo = {
    isMouseDown: false,
    position: {
      x: event.clientX,
      y: event.clientY,
    },
  };
});
canvas.addEventListener("mouseout", (event) => {
  mouseInfo = undefined;
});

const native: Native = {
  record,
  audioPlayer,
};

let fps: number = 0;
let frameCount = 0;
setInterval(() => {
  fps = frameCount;
  frameCount = 0;
}, 1000);

function onFrame(context: CanvasRenderingContext2D) {
  frameCount++;
  context.clearRect(0, 0, canvas.width, canvas.height);

  const renderingDataMap = toMap(renderingDataList);
  const updatingDataMap = toMap(updatingDataList);

  const updateContext: UpdateContext = {
    dataList: updatingDataList,
    renderingDataMap,
    updatingDataMap,
    mouseInfo: mouseInfo,
    newDataList: [],
    removingDataList: [],
    state: stateData,
    native,
    fps,
  };

  update(updateContext);
  render(context, renderingDataList);

  updateContext.removingDataList.forEach((removingData) => {
    const index = updatingDataList.indexOf(removingData);
    updatingDataList.splice(index, 1);
  });
  updatingDataList.push(...updateContext.newDataList);

  requestAnimationFrame(() => onFrame(context));
}

requestAnimationFrame(() => onFrame(context));
