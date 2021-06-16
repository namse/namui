import {
  RenderingDataList,
  renderingDataList,
  RenderingDataMap,
} from "./renderingData";
import { render } from "./render";
import { ClickInfo, update, UpdateContext } from "./update";
import { updatingDataList } from "./updatingData";

const canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);

const context = canvas.getContext("2d");

function toMap(renderingDataList: RenderingDataList): RenderingDataMap {
  const map = {};
  renderingDataList.forEach((renderingData) => {
    map[renderingData.id] = renderingData;
  });
  return map;
}

let clickInfo: ClickInfo;

canvas.addEventListener("click", (event) => {
  clickInfo = {
    position: {
      x: event.clientX,
      y: event.clientY,
    },
  };
});

function onFrame() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  const renderingDataMap = toMap(renderingDataList);
  const updateContext: UpdateContext = {
    dataList: updatingDataList,
    renderingDataMap,
    clickInfo,
    newDataList: [],
    removingDataList: [],
  };

  update(updateContext);
  render(context, renderingDataList);

  clickInfo = undefined;
  updateContext.removingDataList.forEach((removingData) => {
    const index = updatingDataList.indexOf(removingData);
    updatingDataList.splice(index, 1);
  });
  updatingDataList.push(...updateContext.newDataList);

  requestAnimationFrame(onFrame);
}

requestAnimationFrame(onFrame);
