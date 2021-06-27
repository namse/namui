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
import { fileDownloader } from "./native-web/FileDownloader";

function setupCanvasDpi(canvas: HTMLCanvasElement) {
  const rect = {
    width: screen.width,
    height: screen.height,
  };

  if (canvas.width !== rect.width) {
    canvas.width = rect.width;
  }
  if (canvas.height !== rect.height) {
    canvas.height = rect.height;
  }
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
      x: event.pageX,
      y: event.pageY,
    },
  };
});
canvas.addEventListener("mousedown", (event) => {
  mouseInfo = {
    isClick: !mouseInfo?.isClick,
    isMouseDown: true,
    position: {
      x: event.pageX,
      y: event.pageY,
    },
  };
});
canvas.addEventListener("mouseup", (event) => {
  mouseInfo = {
    isClick: false,
    isMouseDown: false,
    position: {
      x: event.pageX,
      y: event.pageY,
    },
  };
});
canvas.addEventListener("mouseout", (event) => {
  mouseInfo = undefined;
});
canvas.addEventListener("touchstart", (event) => {
  mouseInfo = {
    isClick: true,
    isMouseDown: true,
    position: {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY,
    },
  };
});
canvas.addEventListener("touchmove", (event) => {
  mouseInfo = {
    isClick: mouseInfo?.isClick ?? false,
    isMouseDown: mouseInfo?.isMouseDown ?? false,
    position: {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY,
    },
  };
});
canvas.addEventListener("touchend", (event) => {
  mouseInfo = {
    isClick: false,
    isMouseDown: false,
    position: {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY,
    },
  };
});

const native: Native = {
  record,
  audioPlayer,
  audioNetwork,
  audioDownloader,
  fileDownloader,
};

let fps: number = 0;
let frameCount = 0;
setInterval(() => {
  fps = frameCount;
  frameCount = 0;
}, 1000);

function getUpdateContext(): UpdateContext {
  const renderingDataMap = toMap(renderingDataList);
  const updatingDataMap = toMap(updatingDataList);

  return {
    dataList: updatingDataList,
    renderingDataMap,
    updatingDataMap,
    mouseInfo: mouseInfo,
    newDataList: [],
    removingDataList: [],
    state: stateData,
    native,
    fps,
    screenInfo: {
      width: screen.width,
      height: screen.height,
    },
  };
}

function onFrame(context: CanvasRenderingContext2D) {
  frameCount++;
  context.clearRect(0, 0, canvas.width, canvas.height);
  const updateContext = getUpdateContext();
  setupCanvasDpi(canvas);

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
