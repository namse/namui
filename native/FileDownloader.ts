export interface IFileDownloader {
  startDownload(fileName: string): {downloadingId: number};
  isDownloadDone(downloadingId: number): boolean;
  isDownloadError(downloadingId: number): boolean;
  getFileAsObject<T>(downloadingId: number): T;
}
