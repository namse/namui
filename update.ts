import { RenderingDataMap } from "./renderingData";
import { Rotation, UpdatingDataList } from "./updatingData";

export function update(
  updatingDataList: UpdatingDataList,
  renderingDataMap: RenderingDataMap
) {
  updatingDataList.forEach((data) => {
    switch (data.type) {
      case "rotation": {
        updateRotation(renderingDataMap, data);
        return;
      }
      default: {
        console.error(`unknwon data ${data}`);
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

function updateRotation(renderingDataMap: RenderingDataMap, data: Rotation) {
  const { targetId } = data;
  const target = renderingDataMap[targetId];
  if (!target) {
    throw new Error(`cannot find target with target id ${targetId}`);
  }

  switch (target.type) {
    case 'text': {
      const tanslated = translate(target.position, data.anchor);
      const rotated = rotate(tanslated, data.angularVelocity);
      const nextPosition = translate(rotated, multiplyScalarToVector(data.anchor, -1));
      target.position = nextPosition;

      target.rotationAngle += data.angularVelocity;
    } break;
    default: {
      throw new Error(`not support target ${target}`);
    }
  }
}
