import {
  RenderingDataList,
  renderingDataList,
  RenderingDataMap,
} from "./renderingData";
import { render } from "./render";
import { ClickInfo, update, UpdateContext } from "./update";
import { updatingDataList } from "./updatingData";
import { stateData } from "./stateData";
import { Native } from "./native";
import { record } from "./native-web/record/record";

const canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);

const context = canvas.getContext("2d");

function toMap<TItem extends { id: number }>(
  renderingDataList: TItem[]
): { [id: number]: TItem } {
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

const native: Native = {
  record,
};

function onFrame() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const renderingDataMap = toMap(renderingDataList);
  const updatingDataMap = toMap(updatingDataList);

  const updateContext: UpdateContext = {
    dataList: updatingDataList,
    renderingDataMap,
    updatingDataMap,
    clickInfo,
    newDataList: [],
    removingDataList: [],
    state: stateData,
    native,
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
