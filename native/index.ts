import { IAudioPlayer } from "./AudioPlayer";
import { IRecord } from "./Record";

export interface Native {
  record: IRecord;
  audioPlayer: IAudioPlayer;
}
