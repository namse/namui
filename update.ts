import {
  AudioWaveformEditor,
  RenderingData,
  RenderingDataMap,
} from "./renderingData";
import {
  AddAfterClick,
  MapRecordingStateToButtonText,
  Move,
  Rotation,
  RecordOnClick,
  UpdatingDataList,
  UpdatingDataMap,
  AudioWaveform,
  UpdatingData,
  FpsText,
  ControlAudioWaveformEditor,
} from "./updatingData";
import { StateData } from "./stateData";
import { Native } from "./native";

export type MouseInfo = {
  position: {
    x: number;
    y: number;
  };
  isMouseDown: boolean;
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

export function update(context: UpdateContext) {
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
      case "recordOnClick": {
        updateRecordOnclick(context, data);
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
      case "controlAudioWaveformEditor": {
        updateControlAudioWaveformEditor(context, data);
        return;
      }
      default: {
        console.error(`unknwon data`, data);
        return;
      }
    }
  });
}

type Vector = {
  x: number;
  y: number;
};

function multiplyScalarToVector(vector: Vector, value: number): Vector {
  return {
    x: vector.x * value,
    y: vector.y * value,
  };
}

function translate(vector: Vector, deltaVector: Vector): Vector {
  return {
    x: vector.x - deltaVector.x,
    y: vector.y - deltaVector.y,
  };
}

function rotate(vector: Vector, angle: number): Vector {
  const rotatedX = Math.cos(angle) * vector.x - Math.sin(angle) * vector.y;
  const rotatedY = Math.sin(angle) * vector.x + Math.cos(angle) * vector.y;

  return {
    x: rotatedX,
    y: rotatedY,
  };
}

function updateRotation(context: UpdateContext, data: Rotation) {
  const { targetId } = data;
  const target = context.renderingDataMap[targetId];
  if (!target) {
    throw new Error(`cannot find target with target id ${targetId}`);
  }

  switch (target.type) {
    case "text":
      {
        const tanslated = translate(target.position, data.anchor);
        const rotated = rotate(tanslated, data.angularVelocity);
        const nextPosition = translate(
          rotated,
          multiplyScalarToVector(data.anchor, -1)
        );
        target.position = nextPosition;

        target.rotationAngle += data.angularVelocity;
      }
      break;
    default: {
      throw new Error(`not support target ${target}`);
    }
  }
}

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function checkPointInBox(point: Vector, box: Box): boolean {
  return (
    box.x <= point.x &&
    point.x <= box.x + box.width &&
    box.y <= point.y &&
    point.y <= box.y + box.height
  );
}

function checkPositionInRenderingData(
  renderingData: RenderingData,
  position: Vector
): boolean {
  switch (renderingData.type) {
    case "button": {
      return checkPointInBox(position, {
        x: renderingData.position.x,
        y: renderingData.position.y,
        width: renderingData.width,
        height: renderingData.height,
      });
    }
    default: {
      return false;
    }
  }
}

function updateAddAfterClick(
  context: UpdateContext,
  data: AddAfterClick<Rotation>
) {
  if (!context.mouseInfo?.isMouseDown) {
    return;
  }

  const target = context.renderingDataMap[data.targetId];
  if (!target) {
    return;
  }

  const isClicked = checkPositionInRenderingData(
    target,
    context.mouseInfo.position
  );
  if (!isClicked) {
    return;
  }

  context.newDataList.push(data.value);

  if (data.once) {
    context.removingDataList.push(data);
  }
}

function move(target: RenderingData, data: Move) {
  switch (target.type) {
    case "text":
      {
        target.position.x += data.velocity.x;
        target.position.y += data.velocity.y;
      }
      break;
  }
}

function updateMove(context: UpdateContext, data: Move) {
  const target = context.renderingDataMap[data.targetId];
  if (!target) {
    throw new Error("cannot find target");
  }

  move(target, data);
}

function getRenderingTarget<
  TType extends RenderingData["type"],
  TData = Extract<RenderingData, { type: TType }>
>(context: UpdateContext, id: number, type: TType): TData {
  const target = context.renderingDataMap[id];
  if (!target) {
    throw new Error(`cannot find ${id}`);
  }
  if (target.type !== type) {
    throw new Error(`target is not ${type}`);
  }
  return target as unknown as TData;
}

function getUpdatingTarget<
  TType extends UpdatingData["type"],
  TData = Extract<UpdatingData, { type: TType }>
>(context: UpdateContext, id: number, type: TType): TData {
  const target = context.updatingDataMap[id];
  if (!target) {
    throw new Error(`cannot find ${id}`);
  }
  if (target.type !== type) {
    throw new Error(`target is not ${type}`);
  }
  return target as unknown as TData;
}

function updateRecordOnclick(context: UpdateContext, data: RecordOnClick) {
  const recordButton = getRenderingTarget(
    context,
    data.recordButtonId,
    "button"
  );
  const audioWaveform = getUpdatingTarget(
    context,
    data.audioWaveformId,
    "audioWaveform"
  );

  switch (data.state) {
    case "idle": {
      if (!context.mouseInfo?.isMouseDown) {
        break;
      }
      const isClicked = checkPositionInRenderingData(
        recordButton,
        context.mouseInfo.position
      );
      if (!isClicked) {
        break;
      }
      data.state = "initializing";
      audioWaveform.audioBuffer = undefined;
      context.native.record.startInitializeRecord(data.id);
      break;
    }
    case "initializing": {
      if (context.native.record.isInitializingDone(data.id)) {
        context.native.record.startRecord(data.id);
        data.state = "recording";
      } else if (context.native.record.isInitializingError(data.id)) {
        data.state = "idle";
      }
      break;
    }
    case "recording": {
      if (data.realtimeAudioWaveformId) {
        context.native.record.fillAudioWaveformBuffer(
          data.id,
          data.realtimeAudioBuffer
        );
      }

      if (!context.mouseInfo?.isMouseDown) {
        break;
      }
      const isClicked = checkPositionInRenderingData(
        recordButton,
        context.mouseInfo.position
      );
      if (!isClicked) {
        break;
      }
      context.native.record.stopRecord(data.id);
      data.state = "finishing";
      break;
    }
    case "finishing": {
      const result = context.native.record.getResult(data.id);
      if (!result) {
        break;
      }
      audioWaveform.audioBuffer = result.samples;
      data.state = "idle";
      break;
    }
  }

  if (data.realtimeAudioWaveformId) {
    const realtimeAudioWaveformData = getRenderingTarget(
      context,
      data.realtimeAudioWaveformId,
      "uint8AudioWaveform"
    );
    realtimeAudioWaveformData.buffer = data.realtimeAudioBuffer;
  }
}

function updateMapRecordingStateToButtonText(
  context: UpdateContext,
  data: MapRecordingStateToButtonText
) {
  const recordOnClickData = context.updatingDataMap[data.updatingId];
  if (!recordOnClickData) {
    throw new Error("cannot find data");
  }
  if (recordOnClickData.type !== "recordOnClick") {
    throw new Error("data is not recordOnClick");
  }

  const target = context.renderingDataMap[data.buttonId];
  if (!target) {
    throw new Error("cannot find target");
  }

  if (target.type !== "button") {
    throw new Error("target is not button");
  }

  switch (recordOnClickData.state) {
    case "idle": {
      target.text.content = "record";
      break;
    }
    case "initializing": {
      target.text.content = "...";
      break;
    }
    case "recording": {
      target.text.content = "stop";
      break;
    }
    case "finishing": {
      target.text.content = "...";
      break;
    }
  }
}
function updateAudioWaveform(context: UpdateContext, data: AudioWaveform) {
  if (data.audioWaveformId && data.audioBuffer) {
    const audioWaveformData = getRenderingTarget(
      context,
      data.audioWaveformId,
      "float32AudioWaveform"
    );
    audioWaveformData.buffer = data.audioBuffer;
  }

  if (data.playId) {
    if (context.native.audioPlayer.isPlayFinished(data.playId)) {
      context.native.audioPlayer.clearAudio(data.playId);
      data.playId = undefined;
    }
  }

  if (!data.audioBuffer || !context.mouseInfo?.isMouseDown) {
    return;
  }

  const playButton = getRenderingTarget(context, data.playButtonId, "button");
  const isClicked = checkPositionInRenderingData(
    playButton,
    context.mouseInfo.position
  );
  if (!isClicked) {
    return;
  }

  const { playId } = context.native.audioPlayer.playSamples(data.audioBuffer);

  data.playId = playId;
}
function updateFpsText(context: UpdateContext, data: FpsText) {
  const text = getRenderingTarget(context, data.textId, "text");
  text.content = context.fps.toString(10);
}
function updateControlAudioWaveformEditor(
  context: UpdateContext,
  data: ControlAudioWaveformEditor
) {
  const audioWaveformEditor = getRenderingTarget(
    context,
    data.audioWaveformEditorId,
    "audioWaveformEditor"
  );

  dragAudioWaveformEditorBar(context, data, audioWaveformEditor);

  audioWaveformEditor.highlightOn = getHighlightOn(
    context,
    data,
    audioWaveformEditor
  );
}

function dragAudioWaveformEditorBar(
  context: UpdateContext,
  data: ControlAudioWaveformEditor,
  audioWaveformEditor: AudioWaveformEditor
) {
  if (!context.mouseInfo?.isMouseDown) {
    data.draging = undefined;
    return;
  }

  const barMouseOn = getBarMouseOn(context, audioWaveformEditor);

  if (!data.draging) {
    if (barMouseOn === "nothing") {
      return;
    }
    const barBox = getAudioWaveformEdtiorBarBox(
      audioWaveformEditor,
      barMouseOn
    );
    data.draging = {
      bar: barMouseOn,
      anchorX: context.mouseInfo.position.x - barBox.x,
    };
    return;
  }

  let nextBarX = context.mouseInfo.position.x - data.draging.anchorX;
  const oppositeBarBox = getAudioWaveformEdtiorBarBox(
    audioWaveformEditor,
    data.draging.bar === "start" ? "end" : "start"
  );
  if (
    data.draging.bar === "start" &&
    !(nextBarX + audioWaveformEditor.barWidth < oppositeBarBox.x)
  ) {
    nextBarX = oppositeBarBox.x - audioWaveformEditor.barWidth - 1;
  } else if (
    data.draging.bar === "end" &&
    !(oppositeBarBox.x + oppositeBarBox.width < nextBarX)
  ) {
    nextBarX = oppositeBarBox.x + oppositeBarBox.width + 1;
  }

  const nextBarPercent =
    ((nextBarX + audioWaveformEditor.barWidth / 2) /
      audioWaveformEditor.width) *
    100;
  if (data.draging.bar === "start") {
    audioWaveformEditor.startBarPercent = nextBarPercent;
  } else {
    audioWaveformEditor.endBarPercent = nextBarPercent;
  }
}

function getBarMouseOn(
  context: UpdateContext,
  audioWaveformEditor: AudioWaveformEditor
): "start" | "end" | "nothing" {
  if (!context.mouseInfo) {
    return "nothing";
  }
  const startBarBox = getAudioWaveformEdtiorBarBox(
    audioWaveformEditor,
    "start"
  );
  if (checkPointInBox(context.mouseInfo.position, startBarBox)) {
    return "start";
  }

  const endBarBox = getAudioWaveformEdtiorBarBox(audioWaveformEditor, "end");
  if (checkPointInBox(context.mouseInfo.position, endBarBox)) {
    return "end";
  }

  return "nothing";
}

function getHighlightOn(
  context: UpdateContext,
  data: ControlAudioWaveformEditor,
  audioWaveformEditor: AudioWaveformEditor
): AudioWaveformEditor["highlightOn"] {
  if (data.draging?.bar) {
    return data.draging.bar;
  }
  return getBarMouseOn(context, audioWaveformEditor);
}

function getAudioWaveformEdtiorBarBox(
  audioWaveformEditor: AudioWaveformEditor,
  bar: "start" | "end"
): Box {
  const barPercent =
    bar === "start"
      ? audioWaveformEditor.startBarPercent
      : audioWaveformEditor.endBarPercent;
  return {
    x:
      audioWaveformEditor.position.x +
      (barPercent / 100) * audioWaveformEditor.width -
      audioWaveformEditor.barWidth / 2,
    y: audioWaveformEditor.position.y,
    width: audioWaveformEditor.barWidth,
    height: audioWaveformEditor.height,
  };
}
