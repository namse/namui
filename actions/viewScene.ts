import { Button } from "../renderingData";
import { ViewScene } from "../updatingData";
import { updateControlAudioWaveformEditor } from "./AudioWaveformEditor";
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
    if (data.playId) {
      context.native.audioPlayer.stopAudio(data.playId);
      context.native.audioPlayer.playAudio(data.playId);
    } else if (data.audioBuffer) {
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
  changeRecordingState(context, data, "idle");
  startDownloadSceneAudio(context, data);
}
function startDownloadSceneAudio(context: UpdateContext, data: ViewScene) {
  data.audioBuffer = undefined;
  if (data.playId) {
    context.native.audioPlayer.clearAudio(data.playId);
  }
  data.playId = undefined;
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
  handleRecordSavingButton(context, data);
}
const recordingState: {
  previousState?: ViewScene["recordingState"];
  nextState?: ViewScene["recordingState"];
} = {};
function setStateChange(
  previousState: ViewScene["recordingState"],
  nextState: ViewScene["recordingState"]
) {
  recordingState.nextState = nextState;
  recordingState.previousState = previousState;
}
function onStateChanged(
  previousState: ViewScene["recordingState"] | "*",
  nextState: ViewScene["recordingState"] | "*",
  action: () => void
) {
  if (
    (previousState === "*" || previousState === recordingState.previousState) &&
    (nextState === "*" || nextState === recordingState.nextState) &&
    recordingState.previousState !== recordingState.nextState
  ) {
    action();
  }
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
  const recordSaveButton = getRenderingTarget(
    context,
    data.recordSaveButtonId,
    "button"
  );
  const previousState = data.recordingState;
  data.recordingState = nextState;
  setStateChange(previousState, nextState);
  onStateChanged("idle", "initializing", () =>
    context.native.record.startInitializeRecord(data.id)
  );
  onStateChanged("recording", "*", () => {
    context.native.record.stopRecord(data.id);

    audioChunkWaveform.buffer = undefined;
    audioChunkWaveform.isHidden = true;
  });
  onStateChanged("*", "idle", () => {
    recordButton.text.content = "record";
    audioChunkWaveform.isHidden = true;
    recordSaveButton.isHidden = true;
    data.controlAudioWaveformEditorData.isHidden = true;
  });
  onStateChanged("*", "initializing", () => {
    recordButton.text.content = "...";
    audioChunkWaveform.isHidden = true;
    data.controlAudioWaveformEditorData.sourceAudioBuffer = undefined;
  });
  onStateChanged("*", "recording", () => {
    context.native.record.startRecord(data.id);
    recordButton.text.content = "stop record";
    audioChunkWaveform.isHidden = false;
    audioChunkWaveform.buffer = {
      channelChunkDataList: [[]],
      numberOfChannels: 1,
      sampleRate: 44100,
    };
    data.controlAudioWaveformEditorData.isNeedReset = true;
  });
  onStateChanged("*", "*", () => {
    console.log(previousState, nextState);
  });
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
          changeRecordingState(context, data, "initializing");
        }
      }
      break;
    case "initializing":
      {
        if (context.native.record.isInitializingDone(data.id)) {
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
          changeRecordingState(context, data, "editing");
        }
      }
      break;
    case "editing":
      {
        if (isClickButton(context, recordButton)) {
          changeRecordingState(context, data, "initializing");
        }
      }
      break;
  }
}
function handleRecordedAudioWaveformEditor(
  context: UpdateContext,
  data: ViewScene
) {
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

  if (data.recordingState === "recording" && audioChunkWaveform.buffer) {
    const bufferLength = 44100 * (1 / 60);
    const buffer = new Float32Array(bufferLength);
    context.native.record.fillAudioWaveformBufferFloat32(buffer);
    audioChunkWaveform.buffer.channelChunkDataList[0].push(buffer);
  }

  if (data.recordingState === "editing") {
    const result = context.native.record.getResult(data.id);
    if (result) {
      audioChunkWaveform.isHidden = true;
      data.controlAudioWaveformEditorData.isHidden = false;
      recordSaveButton.isHidden = false;
      data.controlAudioWaveformEditorData.sourceAudioBuffer = result.samples;
      const { destAudioBuffer } = data.controlAudioWaveformEditorData;
      if (destAudioBuffer) {
        data.audioBuffer = {
          duration: destAudioBuffer.length / 44100,
          length: destAudioBuffer.length,
          sampleRate: 44100,
          numberOfChannels: 1,
          channelDataList: [destAudioBuffer],
        };
      }
    } else {
      data.controlAudioWaveformEditorData.isHidden = true;
      recordSaveButton.isHidden = true;
    }
  }

  updateControlAudioWaveformEditor(
    context,
    data.controlAudioWaveformEditorData
  );
}

function handleRecordSavingButton(context: UpdateContext, data: ViewScene) {
  const recordSaveButton = getRenderingTarget(
    context,
    data.recordSaveButtonId,
    "button"
  );
  if (
    data.recordSavingId &&
    context.native.audioNetwork.isSaveFinished(data.recordSavingId)
  ) {
    data.recordSavingId = undefined;
    recordSaveButton.text.content = "save record";
    alert("저장 완료");
    return;
  }

  if (
    !data.recordSavingId &&
    isClickButton(context, recordSaveButton) &&
    data.controlAudioWaveformEditorData.destAudioBuffer
  ) {
    const { savingId } = context.native.audioNetwork.saveFloat32PcmAudio(
      data.controlAudioWaveformEditorData.destAudioBuffer,
      `${data.sceneDataList[data.sceneIndex].id}.wav`
    );
    data.recordSavingId = savingId;
    recordSaveButton.text.content = "...";
  }
}
