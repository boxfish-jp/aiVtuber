import { Chat } from ".prisma/client";
import { getChatStore } from "./chatStore";

export const getLatestChat = async (who: string): Promise<Chat | null> => {
  const chatStore = getChatStore();
  const latestChat = await chatStore.getLatestChat(who);
  if (!latestChat) {
    return null;
  }
  const updatedChat = await chatStore.makeAsSended(latestChat.id);
  return updatedChat;
};

export const createChat = async (
  who: string,
  message: string
): Promise<void> => {
  const chatStore = getChatStore();
  await chatStore.createChat(who, message);
};
