import tmi from "tmi.js";
import { createChat } from "../message/opeMess";

export const getTwtich = (channelId: string) => {
  const client = new tmi.Client({
    channels: [channelId],
  });

  client.connect();

  client.on("message", (channel, tags, message, self) => {
    if (self) return;

    createChat("viewer", message);
  });
};
