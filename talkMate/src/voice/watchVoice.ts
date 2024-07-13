import WebSocket from "ws";
import { yukarinetEndpoint } from "../endpoint";
import { createChat } from "../message/opeMess";

export const watchVoice = () => {
  console.log(yukarinetEndpoint);
  const socket = new WebSocket(yukarinetEndpoint);

  socket.onopen = () => {
    console.log("Connected to YukariNet");
  };

  socket.onclose = () => {
    watchVoice();
  };

  socket.onmessage = (evt) => {
    if (typeof evt.data === "string") {
      if (!evt.data.startsWith("{")) {
        const voiceText = evt.data.replace("\r\n", "");
        console.log(voiceText);
        createChat("huguo", voiceText);
      }
    }
  };
};
