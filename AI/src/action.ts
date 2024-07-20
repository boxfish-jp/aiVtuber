import { sleep } from "./sleep";
import { Audio, voiceVoxAudio } from "./TTS/voicevox";

export interface Action {
  speak(callback?: (sendMsg: string) => void): Promise<void>;
}

type sentensesType = {
  order: number;
  text: string;
  audio: Audio;
};

export class AIAction implements Action {
  thinkOutput: string;
  sentenses: sentensesType[] = [];

  constructor(llmResponse: string) {
    llmResponse.replace(/\n/g, "");
    this.thinkOutput = llmResponse;
  }

  initSentenses(): void {
    const thinkOutputArray = this.split();
    for (const [i, thinkOutputSplit] of thinkOutputArray.entries()) {
      this.sentenses.push({
        order: i,
        text: thinkOutputSplit,
        audio: new voiceVoxAudio(thinkOutputSplit),
      });
    }
  }

  split(): string[] {
    return this.thinkOutput.split(/(?<=。|？)/);
  }

  async speak(callback: (sendMsg: string) => void): Promise<void> {
    this.initSentenses();
    for (const sentenses of this.sentenses) {
      await sleep(200);
      sentenses.audio.create();
    }
    for (const sentenses of this.sentenses) {
      if (callback) {
        callback(sentenses.text);
      }
      await sentenses.audio.play();
    }
  }
}
