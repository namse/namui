import { IAudioDownloader } from "./AudioDownloader";
import { IAudioNetwork } from "./AudioNetwork";
import { IAudioPlayer } from "./AudioPlayer";
import { IFileDownloader } from "./FileDownloader";
import { IRecord } from "./Record";

export interface Native {
  record: IRecord;
  audioPlayer: IAudioPlayer;
  audioNetwork: IAudioNetwork;
  audioDownloader: IAudioDownloader;
  fileDownloader: IFileDownloader;
}
