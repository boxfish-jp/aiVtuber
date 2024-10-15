import { getLatestData } from "@/lib/getLatestData";
import { parseExamplePrompt } from "@/lib/parseExamplePrompt";
import { parseSystemPrompt } from "@/lib/parseSystemPrompt";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
	ChatPromptTemplate,
	FewShotChatMessagePromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatVertexAI } from "@langchain/google-vertexai-web";
import { LangChainAdapter, type Message } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages }: { messages: Message[] } = await req.json();
	const chatHistory = messages.map((message) =>
		message.role === "user"
			? new HumanMessage(message.content)
			: new AIMessage(message.content),
	);
	const examplePrompt = ChatPromptTemplate.fromMessages([
		["human", "{input}"],
		["ai", "{output}"],
	]);

	const examples = parseExamplePrompt(await getLatestData(2));

	const fewShotPrompt = new FewShotChatMessagePromptTemplate({
		examplePrompt: examplePrompt,
		examples: examples,
		inputVariables: [],
	});

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

	const fewShotPromptInvoke = await fewShotPrompt.invoke({});
	const systemPrompt = parseSystemPrompt(await getLatestData(1));

	const prompt = ChatPromptTemplate.fromMessages([
		["system", systemPrompt],
		ChatPromptTemplate.fromMessages(fewShotPromptInvoke.toChatMessages()),
		new MessagesPlaceholder("chatHistory"),
	]);
	console.log(await prompt.invoke({ chatHistory: chatHistory }));

	const chain = prompt.pipe(model);
	const stream = await chain.stream({ chatHistory: chatHistory });

	return LangChainAdapter.toDataStreamResponse(stream);
}
