import {
  updateRotation,
  updateAddAfterClick,
  updateMove,
  updateMapRecordingStateToButtonText,
  updateAudioWaveform,
  updateFpsText,
  updateSaveAudioOnClickButton,
} from "./etc";
import { layout } from "./layout";
import { UpdateContext } from "./type";
import { updateViewScene } from "./viewScene";

export function actAll(context: UpdateContext) {
  context.dataList.forEach((data) => {
    switch (data.type) {
      case "rotation": {
        updateRotation(context, data);
        return;
      }
      case "addAfterClick": {
        updateAddAfterClick(context, data);
        return;
      }
      case "move": {
        updateMove(context, data);
        return;
      }
      case "mapRecordingStateToButtonText": {
        updateMapRecordingStateToButtonText(context, data);
        return;
      }
      case "audioWaveform": {
        updateAudioWaveform(context, data);
        return;
      }
      case "fpsText": {
        updateFpsText(context, data);
        return;
      }
      case "saveAudioOnClickButton": {
        updateSaveAudioOnClickButton(context, data);
        return;
      }
      case "viewScene": {
        updateViewScene(context, data);
        return;
      }
      case "layout": {
        layout(context, data);
        return;
      }
      default: {
        console.error(`unknwon data`, data);
        return;
      }
    }
  });
}
