import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import AIConfig from "../../AIConfig.json";
import { ChatVertexAI } from "@langchain/google-vertexai";
import { sleep } from "../sleep";

process.env.GOOGLE_APPLICATION_CREDENTIALS = "./key.json";

export type chatHistoryType = { human: string; ai: string }[];

const createMessages = (
  chatHistory: chatHistoryType
): (HumanMessage | AIMessage)[] => {
  if (chatHistory.length <= 1) {
    return [];
  }
  console.log("chatHistory:", chatHistory);
  const onlyHistory = chatHistory.slice(0, -1);
  let messages: (HumanMessage | AIMessage)[] = [];
  for (const chat of onlyHistory) {
    if (chat.human) {
      messages.push(new HumanMessage(chat.human));
    }
    if (chat.ai) {
      messages.push(new AIMessage(chat.ai));
    }
  }
  return messages;
};

const createInput = (chatHistory: chatHistoryType): string => {
  if (chatHistory.length === 0) {
    throw new Error("chatHistory is empty");
  }
  return chatHistory[chatHistory.length - 1].human;
};

export const think = async (chatHistory: chatHistoryType): Promise<string> => {
  const messages = createMessages(chatHistory);
  const input = createInput(chatHistory);
  console.log("input:", input);
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", AIConfig.prompt.prompt.systemPrompt],
    ["placeholder", `{chat_history}`],
    ["human", `{input}`],
  ]);

  const model = new ChatVertexAI({
    model: AIConfig.prompt.model.modelName,
    maxOutputTokens: AIConfig.prompt.model.maxOutputTokens,
    safetySettings: [
      {
        category: "HARM_CATEGORY_UNSPECIFIED",
        threshold: "HARM_BLOCK_THRESHOLD_UNSPECIFIED",
      },
    ],
  });
  const parser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(parser);
  for (let i = 0; i < AIConfig.prompt.model.maxRetries; i++) {
    try {
      const response = await chain.invoke({
        chat_history: messages,
        input: input,
      });
      return response;
    } catch (e) {
      await sleep(300);
    }
  }
  return "思考が停止しました";
};
