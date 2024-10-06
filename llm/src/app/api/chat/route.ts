import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatVertexAI } from "@langchain/google-vertexai-web";
import { LangChainAdapter, Message } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

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

  const stream = await model.stream(
    messages.map((message) =>
      message.role == "user"
        ? new HumanMessage(message.content)
        : new AIMessage(message.content)
    )
  );

  return LangChainAdapter.toDataStreamResponse(stream);
}
