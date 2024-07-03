import { Chat } from ".prisma/client";
import { getLatestChat } from "../message/opeMess";
import { AiEndpoint } from "../endpoint";

const makeURL = (chat: Chat): string => {
  const endpoint = new URL(AiEndpoint);
  const key = new Date().getTime();
  const params = new URLSearchParams();
  params.append("text", encodeURIComponent(chat.message));
  params.append("key", key.toString());
  params.append("who", chat.who);
  endpoint.search = params.toString();
  return endpoint.href;
};

export const sendAPI = async (who: string) => {
  const chat = await getLatestChat(who);
  if (!chat) {
    return;
  }
  const url = makeURL(chat);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`Failed to send message to AI: ${response.statusText}`);
      return response.text();
    }
  } catch (e) {
    console.log(e);
  }
};
