import { env } from "../env";
import { IFileDownloader } from "../native/FileDownloader";
import { s3FetchGet } from "./util/s3Fetch";

type FileDownloadContext = {
  result?: unknown;
  isError: boolean;
};

class FileDownloader implements IFileDownloader {
  private readonly fileDownloadContexts: Map<number, FileDownloadContext> =
    new Map();
  private nextDownloadingId: number = 1;
  private async goDownload(fileName: string, context: FileDownloadContext) {
    try {
      context.result = await s3FetchGet(env.S3_BUCKET_NAME, fileName);
    } catch (error) {
      context.isError = true;
    }
  }
  startDownload(fileName: string): { downloadingId: number } {
    const downloadingId = this.nextDownloadingId++;
    const context: FileDownloadContext = {
      isError: false,
    };
    this.fileDownloadContexts.set(downloadingId, context);
    this.goDownload(fileName, context);

    return {
      downloadingId,
    };
  }
  isDownloadDone(downloadingId: number): boolean {
    const context = this.fileDownloadContexts.get(downloadingId);
    if (!context) {
      throw new Error("no context");
    }
    return context.result !== undefined;
  }
  isDownloadError(downloadingId: number): boolean {
    const context = this.fileDownloadContexts.get(downloadingId);
    if (!context) {
      throw new Error("no context");
    }
    return context.isError;
  }
  getFileAsObject<T>(downloadingId: number): T {
    const context = this.fileDownloadContexts.get(downloadingId);
    if (!context) {
      throw new Error("no context");
    }
    if (context.result === undefined) {
      throw new Error("not download yet");
    }
    return context.result as T;
  }
}

export const fileDownloader = new FileDownloader();
