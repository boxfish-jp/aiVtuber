import { Chat } from ".prisma/client";
import { getChatStore } from "./chatStore";

type chatHistoryType = { human: string; ai: string }[];

const formatChatHistory = (sessionChats: Chat[]): chatHistoryType => {
  let chatHistory: chatHistoryType = [];
  let tmpHuman: string = "";
  for (const chat of sessionChats) {
    switch (chat.who) {
      case "huguo":
        tmpHuman += `ふぐお「${chat.message}」`;
        break;
      case "viewer":
        tmpHuman += `視聴者「${chat.message}」`;
        break;
      case "ai":
        chatHistory.push({ human: tmpHuman, ai: chat.message });
      default:
        throw new Error(`Invalid who:${chat.who}`);
    }
  }
  return chatHistory;
};

export const getChatHistory = async (): Promise<chatHistoryType> => {
  const chatStore = getChatStore();
  const latestClearedChat = await chatStore.getLatestClearedChat();
  if (!latestClearedChat) {
    return [];
  }
  const sessionChats = await chatStore.getSessionChat(latestClearedChat.id);
  const chatHistory = formatChatHistory(sessionChats);
  return chatHistory;
};

export const makeLatestAsCleared = async (): Promise<String> => {
  const chatStore = getChatStore();
  const latestChat = await chatStore.getLatestChat();
  if (!latestChat) {
    return "No chat in the database";
  }
  const result = await chatStore.makeAsCleared(latestChat.id);
  return result.message;
};

export const createChat = async (
  who: string,
  message: string
): Promise<void> => {
  const chatStore = getChatStore();
  await chatStore.createChat(who, message);
};
