import { Chat, PrismaClient } from ".prisma/client";

interface ChatStore {
  getLatestChat(): Promise<Chat | null>;
  getLatestClearedChat(): Promise<Chat | null>;
  getSessionChat(sessionRangeStartId: number): Promise<Chat[]>;
  makeAsCleared(chatId: number): Promise<Chat>;
  createChat(who: string, message: string): Promise<Chat>;
}

class PrismaChatStore implements ChatStore {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getLatestChat(): Promise<Chat | null> {
    return await this.prisma.chat.findFirst({
      orderBy: { id: "desc" },
    });
  }

  async getLatestClearedChat(): Promise<Chat | null> {
    return await this.prisma.chat.findFirst({
      where: { clear: true },
      orderBy: { id: "desc" },
    });
  }

  async getSessionChat(sessionRangeStartId: number): Promise<Chat[]> {
    return await this.prisma.chat.findMany({
      where: { id: { gte: sessionRangeStartId } },
    });
  }

  async makeAsCleared(chatId: number): Promise<Chat> {
    return await this.prisma.chat.update({
      where: { id: chatId },
      data: { clear: true },
    });
  }

  async createChat(who: string, message: string): Promise<Chat> {
    return await this.prisma.chat.create({
      data: {
        who: who,
        message: message,
      },
    });
  }
}

let chatStore: ChatStore | null = null;
export const getChatStore = (): ChatStore => {
  if (!chatStore) {
    chatStore = new PrismaChatStore();
  }
  return chatStore;
};
