import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatVertexAI } from "@langchain/google-vertexai-web";
import { chatHistoryType, examplePromptType } from "./types";

export const llm = async (
  system: string,
  examples: examplePromptType,
  chatHistory: chatHistoryType,
  input: string
) => {
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

  return await chain.stream({
    chat_history: chatHistory,
    input: input,
  });
};
