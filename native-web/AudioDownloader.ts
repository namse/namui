import { GetObjectCommand } from "@aws-sdk/client-s3";
import { CommonAudioBuffer } from "../common/AudioBuffer";
import { IAudioDownloader } from "../native/AudioDownloader";
import { toCommonAudioBuffer } from "./util/AudioBuffer";
import { readAsArrayBuffer } from "./util/fileReader";
import { readAll } from "./util/ReadableStream";
import { s3Client } from "./util/s3Client";

type DownloadingContext = {
  audioBuffer?: CommonAudioBuffer;
};

class AudioDownloader implements IAudioDownloader {
  private nextDownloadingId: number = 0;
  private readonly downloadingContexts: { [id: number]: DownloadingContext } =
    {};

  async getAndSaveAudio(context: DownloadingContext, filename: string) {
    const output = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename,
      })
    );
    if (!output.Body) {
      throw new Error("no body");
    }
    let arrayBuffer: ArrayBuffer;
    if (output.Body instanceof Blob) {
      arrayBuffer = await readAsArrayBuffer(output.Body as Blob);
    } else if (output.Body instanceof ReadableStream) {
      arrayBuffer = await readAll(output.Body);
    } else {
      throw new Error("unknown type");
    }

    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const commonAudioBuffer = toCommonAudioBuffer(audioBuffer);

    context.audioBuffer = commonAudioBuffer;
  }
  startDownloadAudio(filename: string): { downloadingId: number } {
    const downloadingId = this.nextDownloadingId++;
    const context: DownloadingContext = {};
    this.downloadingContexts[downloadingId] = context;

    this.getAndSaveAudio(context, filename);

    return {
      downloadingId,
    };
  }
  isDownloadDone(downloadingId: number): boolean {
    return !!this.downloadingContexts[downloadingId]?.audioBuffer;
  }
  getDownloadedAudio(downloadingId: number): CommonAudioBuffer {
    const audioBuffer = this.downloadingContexts[downloadingId]?.audioBuffer;
    if (!audioBuffer) {
      throw new Error("download is not finished");
    }
    return audioBuffer;
  }
  isDownloadError(downloadingId: number): boolean {
    console.error("Method not implemented.");
    return false;
  }
}

export const audioDownloader = new AudioDownloader();
