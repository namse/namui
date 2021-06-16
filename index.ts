import { RenderingDataList, renderingDataList, RenderingDataMap } from "./renderingData";
import { render } from "./render";
import { update } from "./update";
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

function onFrame() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  const renderingDataMap = toMap(renderingDataList);
  update(updatingDataList, renderingDataMap);
  render(context, renderingDataList);
  requestAnimationFrame(onFrame);
}

requestAnimationFrame(onFrame);
