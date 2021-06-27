import { Layout } from "../updatingData";
import { getRenderingTarget } from "./etc";
import { UpdateContext } from "./type";

export function layout(context: UpdateContext, data: Layout) {
  const { screenInfo } = context;

  const { contentWidth, sidePadding } = getAdaptiveContentLayout(context);

  const textBox = getRenderingTarget(context, data.textBoxId, "textBox");
  const nextButton = getRenderingTarget(context, data.nextButtonId, "button");
  const previousButton = getRenderingTarget(
    context,
    data.previousButtonId,
    "button"
  );
  const playAudioButton = getRenderingTarget(
    context,
    data.playAudioButtonId,
    "button"
  );
  const recordButton = getRenderingTarget(
    context,
    data.recordButtonId,
    "button"
  );
  const audioPlayer = getRenderingTarget(
    context,
    data.audioPlayerId,
    "audioWaveformPlayer"
  );
  const audioChunkWaveform = getRenderingTarget(
    context,
    data.recordingAudioChunkWaveformId,
    "audioChunkWaveform"
  );
  const recordSaveButton = getRenderingTarget(
    context,
    data.recordSaveButtonId,
    "button"
  );
  const audioWaveformEditor = getRenderingTarget(
    context,
    data.audioWaveformEditorId,
    "audioWaveformEditor"
  );

  previousButton.position.x = sidePadding;
  textBox.position.x = sidePadding;
  audioPlayer.position.x = sidePadding;
  audioChunkWaveform.position.x = sidePadding;
  audioWaveformEditor.position.x = sidePadding;

  recordButton.position.x = screenInfo.width - sidePadding - recordButton.width;
  nextButton.position.x = screenInfo.width - sidePadding - nextButton.width;
  playAudioButton.position.x =
    screenInfo.width - sidePadding - playAudioButton.width;
  recordSaveButton.position.x =
    screenInfo.width - sidePadding - recordSaveButton.width;

  textBox.width = contentWidth;
  audioChunkWaveform.width = contentWidth - 120;
  audioPlayer.width = contentWidth - 120;
  audioWaveformEditor.width = contentWidth - 120;
}

function getAdaptiveContentLayout(context: UpdateContext): {
  contentWidth: number;
  sidePadding: number;
} {
  const contentWidthCandidates = [920, 460, 230];
  for (const contentWidth of contentWidthCandidates) {
    const sidePadding = (context.screenInfo.width - contentWidth) / 2;
    if (sidePadding >= 0) {
      return {
        contentWidth,
        sidePadding,
      };
    }
  }

  throw new Error("window is too small");
}
