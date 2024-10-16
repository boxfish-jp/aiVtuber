import { sleep } from "./sleep";
import { Audio, voiceVoxAudio } from "./TTS/voicevox";

export interface Action {
  speak(callback?: (msg: string) => void): Promise<void>;
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
    return this.thinkOutput.split(/(?<=。|？|、)/);
  }
  
  async makeAudio(): Promise<void> {
    for (const sentenses of this.sentenses) {
      sentenses.audio.create();
      await sleep(200);
    }
  }
  
  async playAudio(callback: (msg: string) => void): Promise<void> {
    for (const sentenses of this.sentenses) {
      if (callback) {
        callback(sentenses.text);
      }
      await sentenses.audio.play();
    }
  }

  async speak(callback: (msg: string) => void): Promise<void> {
    this.initSentenses();
    this.makeAudio();
    await this.playAudio(callback);
  }
}
