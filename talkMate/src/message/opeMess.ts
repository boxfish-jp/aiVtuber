import { Chat } from ".prisma/client";
import { getChatStore } from "./chatStore";
import { broadcast } from "@/server/socketServer";

type chatHistoryType = { human: string; AI: string }[];

const formatChatHistory = (sessionChats: Chat[]): chatHistoryType => {
  let chatHistory: chatHistoryType = [];
  let tmpHuman: string = "";
  for (const [i, chat] of sessionChats.entries()) {
    switch (chat.who) {
      case "fuguo":
        tmpHuman += `ふぐお「${chat.message}」`;
        break;
      case "viewer":
        tmpHuman += `視聴者「${chat.message}」`;
        break;
      case "ai":
        chatHistory.push({ human: tmpHuman, AI: chat.message });
        tmpHuman = "";
        break;
      default:
        throw new Error(`Invalid who:${chat.who}`);
    }
    if (i === sessionChats.length - 1) {
      chatHistory.push({ human: tmpHuman, AI: "" });
    }
  }
  return chatHistory;
};

export const getChatHistory = async (
  chatId: number
): Promise<chatHistoryType> => {
  const chatStore = getChatStore();
  const sessionChats = await chatStore.getSessionChat(chatId);
  const chatHistory = formatChatHistory(sessionChats);
  return chatHistory;
};

export const createChat = async (
  who: string,
  message: string
): Promise<void> => {
  const chatStore = getChatStore();
  const result = await chatStore.createChat(who, message);
  broadcast(JSON.stringify([result]));
};
