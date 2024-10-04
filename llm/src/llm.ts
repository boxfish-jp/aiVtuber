import { HumanMessage, AIMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatVertexAI } from "@langchain/google-vertexai-web";
import { chatHistoryType, examplePromptType } from "./types";

const createMessages = (
  chatHistory: chatHistoryType
): (HumanMessage | AIMessage)[] => {
  if (chatHistory.length <= 1) {
    return [];
  }
  const onlyHistory = chatHistory.slice(0, -1);
  let messages: (HumanMessage | AIMessage)[] = [];
  for (const chat of onlyHistory) {
    if (chat.human) {
      messages.push(new HumanMessage(chat.human));
    }
    if (chat.AI) {
      messages.push(new AIMessage(chat.AI));
    }
  }
  return messages;
};

export const llm = async (
  system: string,
  examples: examplePromptType,
  chatHistory: chatHistoryType,
  input: string
) => {
  const messages = createMessages(chatHistory);
  const examplePrompt = ChatPromptTemplate.fromMessages([
    ["human", "{input}"],
    ["ai", "{output}"],
  ]);

  const fewShotPrompt = new FewShotChatMessagePromptTemplate({
    examplePrompt: examplePrompt,
    examples: examples,
    inputVariables: [],
  });

  const fewShotPromptInvoke = await fewShotPrompt.invoke({});
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", system],
    ["placeholder", `{chat_history}`],
    ChatPromptTemplate.fromMessages(fewShotPromptInvoke.toChatMessages()),
    ["human", `{input}`],
  ]);

  const model = new ChatVertexAI({
    model: "gemini-1.0-pro",
    maxOutputTokens: 75,
    safetySettings: [
      {
        category: "HARM_CATEGORY_UNSPECIFIED",
        threshold: "HARM_BLOCK_THRESHOLD_UNSPECIFIED",
      },
    ],
  });

  const parser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(parser);

  return chain.invoke({ chat_history: messages, input: input });
};
