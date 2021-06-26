import { ViewScene } from "../updatingData";
import { getRenderingTarget, isClickButton } from "./etc";
import { UpdateContext } from "./type";

function handleText(context: UpdateContext, data: ViewScene) {
  const textBox = getRenderingTarget(context, data.textBoxId, "textBox");
  const text = data.sceneDataList[data.sceneIndex].text;
  textBox.content = text;
}
function handlePlayAudioButton(context: UpdateContext, data: ViewScene) {
  const playAudioButton = getRenderingTarget(
    context,
    data.playAudioButtonId,
    "button"
  );
  if (isClickButton(context, playAudioButton)) {
    if (data.audioBuffer) {
      context.native.audioPlayer.playAudioBuffer(data.audioBuffer);
    }
  }
}

function handleNextPrevButton(context: UpdateContext, data: ViewScene) {
  const nextButton = getRenderingTarget(context, data.nextButtonId, "button");
  const previousButton = getRenderingTarget(
    context,
    data.previousButtonId,
    "button"
  );
  if (isClickButton(context, nextButton)) {
    data.sceneIndex = Math.min(
      data.sceneIndex + 1,
      data.sceneDataList.length - 1
    );
    onChangeScene(context, data);
  } else if (isClickButton(context, previousButton)) {
    data.sceneIndex = Math.max(data.sceneIndex - 1, 0);
    onChangeScene(context, data);
  }
}

export function updateViewScene(context: UpdateContext, data: ViewScene) {
  handleText(context, data);
  handlePlayAudioButton(context, data);
  handleNextPrevButton(context, data);
  updateAudio(context, data);
}

function onChangeScene(context: UpdateContext, data: ViewScene) {
  startDownloadSceneAudio(context, data);
}
function startDownloadSceneAudio(context: UpdateContext, data: ViewScene) {
  data.audioBuffer = undefined;
  data.isErrorOnAudioBufferDownloading = undefined;
  const sceneData = data.sceneDataList[data.sceneIndex];
  const { downloadingId } = context.native.audioDownloader.startDownloadAudio(
    `${sceneData.id}.wav`
  );
  data.audioBufferDownloadingId = downloadingId;
}
function updateAudio(context: UpdateContext, data: ViewScene) {
  if (data.isErrorOnAudioBufferDownloading) {
    return;
  }

  if (!data.audioBufferDownloadingId) {
    startDownloadSceneAudio(context, data);
    return;
  }

  if (
    context.native.audioDownloader.isDownloadError(
      data.audioBufferDownloadingId
    )
  ) {
    console.error("error to download audio");
    data.isErrorOnAudioBufferDownloading = true;
    return;
  }

  if (
    context.native.audioDownloader.isDownloadDone(
      data.audioBufferDownloadingId
    ) &&
    !data.audioBuffer
  ) {
    data.audioBuffer = context.native.audioDownloader.getDownloadedAudio(
      data.audioBufferDownloadingId
    );
    data.isErrorOnAudioBufferDownloading = false;
  }
}
