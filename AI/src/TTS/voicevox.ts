import { writeFileSync, unlinkSync } from "fs";
import sound from "sound-play";
import path from "path";
import { sleep } from "../sleep";
import endpoint from "../../../endpoint.json";
import AIConfig from "../../AIConfig.json";

export interface Audio {
  create(): Promise<void>;
  play(): Promise<void>;
}

export class voiceVoxAudio implements Audio {
  params = {
    text: "",
    speaker: AIConfig.voice.speakerId.toString(),
  };
  filePath = "";

  constructor(text: string) {
    this.params.text = text;
  }

  get alreadyCreated(): boolean {
    //console.log("filePath: ", this.filePath);
    return this.filePath !== "";
  }

  async fetchAudioQuery(): Promise<any> {
    const url = `http://${endpoint.TTS.ip}:${
      endpoint.TTS.port
    }/audio_query?${new URLSearchParams(this.params).toString()}`;
    try {
      const res = await fetch(url, {
        method: "POST",
      });
      console.log("response1 status code: ", res.status);
      return res.json();
    } catch (error) {
      throw new Error(`Failed to fetch synthesis: ${String(error)}`);
    }
  }

  async fetchSynthesis(audioJsonData: any): Promise<ArrayBuffer> {
    const url = `http://${endpoint.TTS.ip}:${
      endpoint.TTS.port
    }/synthesis?${new URLSearchParams(this.params).toString()}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(audioJsonData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("response2 status code: ", res.status);
      return res.arrayBuffer();
    } catch (error) {
      throw new Error(`Failed to fetch synthesis: ${String(error)}`);
    }
  }

  async saveAudio(audioData: any): Promise<void> {
    const fileName = path.join(__dirname, `./${new Date().getTime()}.wav`);
    try {
      const buffer = Buffer.from(audioData);
      writeFileSync(fileName, buffer);
    } catch (e) {
      throw new Error(`Failed to save audio: ${String(e)}`);
    }
    this.filePath = fileName;
    console.log("Audio created: ", this.filePath);
  }

  async deleteAudio(): Promise<void> {
    try {
      unlinkSync(this.filePath);
    } catch (e) {
      throw new Error(`Failed to delete audio: ${String(e)}`);
    }
    this.filePath = "";
  }

  async create() {
    console.log("Creating audio...", this.params.text);
    const audioJsonData = await this.fetchAudioQuery();
    const audioData = await this.fetchSynthesis(audioJsonData);
    await this.saveAudio(audioData);
  }

  async play() {
    while (!this.alreadyCreated) {
      await sleep(50);
      console.log("Waiting for audio to be created...");
    }
    try {
      console.log("play", this.filePath);
      await sound.play(this.filePath);
      this.deleteAudio();
    } catch (e) {
      throw new Error(`Failed to play audio: ${String(e)}`);
    }
  }
}
