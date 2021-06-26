import { IAudioNetwork } from "../../native/AudioNetwork";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { encodeAudioBufferToWav } from "./encodeAudioBuffer";
import { s3Client } from "../util/s3Client";

type AudioSavingContext = {
  isSaving: boolean;
};

class AudioNetwork implements IAudioNetwork {
  private static nextSavingId: number = 1;
  private static savingContexts: { [savingId: number]: AudioSavingContext } =
    {};
  isSaveFinished(savingId: number): boolean {
    const context = AudioNetwork.savingContexts[savingId];
    if (!context) {
      throw new Error("Cannot find savingContext with savingId");
    }
    return !context.isSaving;
  }
  saveFloat32PcmAudio(
    float32PcmBuffer: Float32Array,
    filename: string
  ): { savingId: any } {
    const savingId = AudioNetwork.nextSavingId++;
    const context: AudioSavingContext = {
      isSaving: true,
    };
    AudioNetwork.savingContexts[savingId] = context;
    const blob = encodeAudioBufferToWav(float32PcmBuffer);

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
      Body: blob,
    });
    s3Client
      .send(putObjectCommand)
      .then(() => {
        context.isSaving = false;
      })
      .catch((error) => {
        console.error(error);
        context.isSaving = false;
      });

    return {
      savingId,
    };
  }
}

export const audioNetwork = new AudioNetwork();
