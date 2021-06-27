import { AudioWaveformEditor } from "../renderingData";
import { ControlAudioWaveformEditorV2 } from "../updatingData";
import { checkPointInBox, getRenderingTarget } from "./etc";
import { Box, UpdateContext } from "./type";

export function updateControlAudioWaveformEditor(
  context: UpdateContext,
  data: ControlAudioWaveformEditorV2
) {
  const audioWaveformEditor = getRenderingTarget(
    context,
    data.audioWaveformEditorId,
    "audioWaveformEditor"
  );
  audioWaveformEditor.isHidden = data.isHidden;
  updateReset(context, data, audioWaveformEditor);

  dragAudioWaveformEditorBar(context, data, audioWaveformEditor);

  audioWaveformEditor.highlightOn = getHighlightOn(
    context,
    data,
    audioWaveformEditor
  );

  audioWaveformEditor.buffer = data.sourceAudioBuffer;

  updateDestAudioBuffer(context, data, audioWaveformEditor);
}

function updateDestAudioBuffer(
  context: UpdateContext,
  data: ControlAudioWaveformEditorV2,
  audioWaveformEditor: AudioWaveformEditor
) {
  if (!data.sourceAudioBuffer) {
    data.destAudioBuffer = undefined;
    return;
  }
  const begin = Math.floor(
    (audioWaveformEditor.startBarPercent / 100) * data.sourceAudioBuffer.length
  );
  const end = Math.floor(
    (audioWaveformEditor.endBarPercent / 100) * data.sourceAudioBuffer.length
  );
  data.destAudioBuffer = data.sourceAudioBuffer.subarray(begin, end);
}

function dragAudioWaveformEditorBar(
  context: UpdateContext,
  data: ControlAudioWaveformEditorV2,
  audioWaveformEditor: AudioWaveformEditor
) {
  if (!context.mouseInfo?.isMouseDown) {
    data.dragging = undefined;
    return;
  }

  const barMouseOn = getBarMouseOn(context, audioWaveformEditor);

  if (!data.dragging) {
    if (barMouseOn === "nothing") {
      return;
    }
    const barBox = getAudioWaveformEdtiorBarBox(
      audioWaveformEditor,
      barMouseOn
    );
    data.dragging = {
      bar: barMouseOn,
      anchorX: context.mouseInfo.position.x - barBox.x,
    };
    return;
  }

  let nextBarAbsoluteX = context.mouseInfo.position.x - data.dragging.anchorX;
  const oppositeBarBox = getAudioWaveformEdtiorBarBox(
    audioWaveformEditor,
    data.dragging.bar === "start" ? "end" : "start"
  );
  if (
    data.dragging.bar === "start" &&
    !(nextBarAbsoluteX + audioWaveformEditor.barWidth < oppositeBarBox.x)
  ) {
    nextBarAbsoluteX = oppositeBarBox.x - audioWaveformEditor.barWidth - 1;
  } else if (
    data.dragging.bar === "end" &&
    !(oppositeBarBox.x + oppositeBarBox.width < nextBarAbsoluteX)
  ) {
    nextBarAbsoluteX = oppositeBarBox.x + oppositeBarBox.width + 1;
  }

  const nextBarPercent =
    Math.min(
      1,
      Math.max(
        0,
        (nextBarAbsoluteX -
          audioWaveformEditor.position.x +
          audioWaveformEditor.barWidth / 2) /
          audioWaveformEditor.width
      )
    ) * 100;
  if (data.dragging.bar === "start") {
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
  data: ControlAudioWaveformEditorV2,
  audioWaveformEditor: AudioWaveformEditor
): AudioWaveformEditor["highlightOn"] {
  if (data.dragging?.bar) {
    return data.dragging.bar;
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
function updateReset(
  context: UpdateContext,
  data: ControlAudioWaveformEditorV2,
  audioWaveformEditor: AudioWaveformEditor
) {
  if (data.isNeedReset) {
    audioWaveformEditor.startBarPercent = 0;
    audioWaveformEditor.endBarPercent = 100;
    data.isNeedReset = false;
  }
}
