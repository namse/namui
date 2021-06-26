import { Native } from "../native";
import { RenderingDataMap } from "../renderingData";
import { StateData } from "../stateData";
import { UpdatingDataList, UpdatingDataMap } from "../updatingData";

export type MouseInfo = {
  position: {
    x: number;
    y: number;
  };
  isMouseDown: boolean;
  isClick: boolean;
};
export type UpdateContext = {
  dataList: UpdatingDataList;
  updatingDataMap: UpdatingDataMap;
  renderingDataMap: RenderingDataMap;
  mouseInfo?: MouseInfo;
  newDataList: UpdatingDataList;
  removingDataList: UpdatingDataList;
  state: StateData;
  native: Native;
  fps: number;
};
export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};
