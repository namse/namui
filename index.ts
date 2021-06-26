import {
  RenderingDataList,
  renderingDataList,
  RenderingDataMap,
} from "./renderingData";
import { render } from "./render";
import { updatingDataList } from "./updatingData";
import { stateData } from "./stateData";
import { Native } from "./native";
import { record } from "./native-web/record/Record";
import { audioPlayer } from "./native-web/AudioPlayer";
import { audioNetwork } from "./native-web/audioNetwork/AudioNetwork";
import { audioDownloader } from "./native-web/AudioDownloader";
import { MouseInfo, UpdateContext } from "./actions/type";
import { actAll } from "./actions";

function setupCanvasDpi(canvas: HTMLCanvasElement) {
  // Get the device pixel ratio, falling back to 1.
  const dpr = window.devicePixelRatio || 1;
  // Get the size of the canvas in CSS pixels.
  const rect = canvas.getBoundingClientRect();
  // Give the canvas pixel dimensions of their CSS
  // size * the device pixel ratio.
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext("2d");
  // Scale all drawing operations by the dpr, so you
  // don't have to worry about the difference.
  ctx?.scale(dpr, dpr);
}
const canvas = document.createElement("canvas");
canvas.width = 1920;
canvas.height = 1080;
document.body.appendChild(canvas);
setupCanvasDpi(canvas);

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
    isClick: mouseInfo?.isClick ?? false,
    isMouseDown: mouseInfo?.isMouseDown ?? false,
    position: {
      x: event.clientX,
      y: event.clientY,
    },
  };
});
canvas.addEventListener("mousedown", (event) => {
  mouseInfo = {
    isClick: !mouseInfo?.isClick,
    isMouseDown: true,
    position: {
      x: event.clientX,
      y: event.clientY,
    },
  };
});
canvas.addEventListener("mouseup", (event) => {
  mouseInfo = {
    isClick: false,
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
  audioNetwork,
  audioDownloader,
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

  actAll(updateContext);
  render(context, renderingDataList);

  updateContext.removingDataList.forEach((removingData) => {
    const index = updatingDataList.indexOf(removingData);
    updatingDataList.splice(index, 1);
  });
  updatingDataList.push(...updateContext.newDataList);

  if (mouseInfo) {
    mouseInfo.isClick = false;
  }

  requestAnimationFrame(() => onFrame(context));
}

requestAnimationFrame(() => onFrame(context));

(window as any).dump = () => {
  console.log(renderingDataList, updatingDataList);
};
