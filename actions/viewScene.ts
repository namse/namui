import { Button } from "../renderingData";
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
      const { playId } = context.native.audioPlayer.playAudioBuffer(
        data.audioBuffer
      );
      data.playId = playId;
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
  handleLoadingAudio(context, data);
  handleAudioPlayer(context, data);
  handleRecord(context, data);
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
function handleLoadingAudio(context: UpdateContext, data: ViewScene) {
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
function handleAudioPlayer(context: UpdateContext, data: ViewScene) {
  const audioPlayer = getRenderingTarget(
    context,
    data.audioPlayerId,
    "audioWaveformPlayer"
  );
  audioPlayer.buffer = data.audioBuffer;
  if (data.playId) {
    audioPlayer.playBarXRatio = context.native.audioPlayer.getPlaybackTimeRate(
      data.playId
    );
  }
}
function handleRecord(context: UpdateContext, data: ViewScene) {
  const recordButton = getRenderingTarget(
    context,
    data.recordButtonId,
    "button"
  );
  handleRecordButtonClick(context, data, recordButton);
  handleRecordedAudioWaveformEditor(context, data);
}
function changeRecordingState(
  context: UpdateContext,
  data: ViewScene,
  nextState: ViewScene["recordingState"]
) {
  const audioChunkWaveform = getRenderingTarget(
    context,
    data.recordingAudioChunkWaveformId,
    "audioChunkWaveform"
  );
  const recordButton = getRenderingTarget(
    context,
    data.recordButtonId,
    "button"
  );
  const waveformEdtior = getRenderingTarget(
    context,
    data.recordedWaveformEditorId,
    "audioWaveformEditor"
  );
  data.recordingState = nextState;
  switch (data.recordingState) {
    case "idle":
      {
        recordButton.text.content = "record";
        audioChunkWaveform.isHidden = true;
        recordButton.text.content = "record";
      }
      break;
    case "initializing":
      {
        recordButton.text.content = "...";
        audioChunkWaveform.isHidden = true;
        waveformEdtior.buffer = undefined;
      }
      break;
    case "recording":
      {
        recordButton.text.content = "stop record";
        audioChunkWaveform.isHidden = false;
        audioChunkWaveform.buffer = {
          channelChunkDataList: [[]],
          numberOfChannels: 1,
          sampleRate: 44100,
        };
      }
      break;
  }
}
function handleRecordButtonClick(
  context: UpdateContext,
  data: ViewScene,
  recordButton: Button
) {
  switch (data.recordingState) {
    case "idle":
      {
        if (isClickButton(context, recordButton)) {
          context.native.record.startInitializeRecord(data.id);
          changeRecordingState(context, data, "initializing");
        }
      }
      break;
    case "initializing":
      {
        if (context.native.record.isInitializingDone(data.id)) {
          context.native.record.startRecord(data.id);
          changeRecordingState(context, data, "recording");
        } else if (context.native.record.isInitializingError(data.id)) {
          console.error("fail to initialze record");
          changeRecordingState(context, data, "idle");
        }
      }
      break;
    case "recording":
      {
        if (isClickButton(context, recordButton)) {
          context.native.record.stopRecord(data.id);
          changeRecordingState(context, data, "idle");
        }
      }
      break;
  }
}
function handleRecordedAudioWaveformEditor(
  context: UpdateContext,
  data: ViewScene
) {
  const waveformEdtior = getRenderingTarget(
    context,
    data.recordedWaveformEditorId,
    "audioWaveformEditor"
  );
  const audioChunkWaveform = getRenderingTarget(
    context,
    data.recordingAudioChunkWaveformId,
    "audioChunkWaveform"
  );

  if (data.recordingState === "recording" && audioChunkWaveform.buffer) {
    const bufferLength = 44100 * (1 / 60);
    const buffer = new Float32Array(bufferLength);
    context.native.record.fillAudioWaveformBufferFloat32(buffer);
    audioChunkWaveform.buffer.channelChunkDataList[0].push(buffer);
  }
}
