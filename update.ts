import { RenderingData, RenderingDataMap } from "./renderingData";
import {
  AddAfterClick,
  MapRecordingStateToButtonText,
  Move,
  Rotation,
  StartRecordOnClick,
  UpdatingDataList,
} from "./updatingData";
import { StateData } from "./stateData";

export type ClickInfo = {
  position: {
    x: number;
    y: number;
  };
};

export type UpdateContext = {
  dataList: UpdatingDataList;
  renderingDataMap: RenderingDataMap;
  clickInfo?: ClickInfo;
  newDataList: UpdatingDataList;
  removingDataList: UpdatingDataList;
  state: StateData;
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
      case "startRecordOnClick": {
        updateStartRecordOnclick(context, data);
        return;
      }
      case "mapRecordingStateToButtonText": {
        updateMapRecordingStateToButtonText(context, data);
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

function checkPositionInRenderingData(
  renderingData: RenderingData,
  position: Vector
): boolean {
  switch (renderingData.type) {
    case "button": {
      return (
        renderingData.position.x <= position.x &&
        position.x <= renderingData.position.x + renderingData.width &&
        renderingData.position.y <= position.y &&
        position.y <= renderingData.position.y + renderingData.height
      );
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
  if (!context.clickInfo) {
    return;
  }

  const target = context.renderingDataMap[data.targetId];
  if (!target) {
    return;
  }

  const isClicked = checkPositionInRenderingData(
    target,
    context.clickInfo.position
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

function updateStartRecordOnclick(
  context: UpdateContext,
  data: StartRecordOnClick
) {
  if (!context.clickInfo || context.state.recordingState !== "idle") {
    return;
  }

  const target = context.renderingDataMap[data.buttonId];
  if (!target) {
    throw new Error("cannot find target");
  }

  if (target.type !== "button") {
    throw new Error("target is not button");
  }

  const isClicked = checkPositionInRenderingData(
    target,
    context.clickInfo.position
  );
  if (!isClicked) {
    return;
  }

  context.state.recordingState = "initializing";
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })
    .then((stream) => {
      const recorder = new MediaRecorder(stream);
      recorder.start();
      console.log("record started!");
      context.state.recordingState = "recording";
    })
    .catch((error) => {
      console.error(error);
      context.state.recordingState = "idle";
    });
}

function updateMapRecordingStateToButtonText(
  context: UpdateContext,
  data: MapRecordingStateToButtonText
) {
  const target = context.renderingDataMap[data.buttonId];
  if (!target) {
    throw new Error("cannot find target");
  }

  if (target.type !== "button") {
    throw new Error("target is not button");
  }

  switch (context.state.recordingState) {
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
  }
}
