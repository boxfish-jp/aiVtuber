import { Chat, PrismaClient } from ".prisma/client";

interface ChatStore {
  getLatestChat(who: string): Promise<Chat | null>;
  makeAsSended(chatId: number): Promise<Chat>;
  createChat(who: string, message: string): Promise<void>;
}

class PrismaChatStore implements ChatStore {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getLatestChat(who: string): Promise<Chat | null> {
    return await this.prisma.chat.findFirst({
      where: { who },
      orderBy: { id: "desc" },
    });
  }

  async makeAsSended(chatId: number): Promise<Chat> {
    return await this.prisma.chat.update({
      where: { id: chatId },
      data: { sended: true },
    });
  }

  async createChat(who: string, message: string): Promise<void> {
    await this.prisma.chat.create({
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
