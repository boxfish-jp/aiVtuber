import { getPromptHistory } from "@/lib/getPromptHistory";
import { parseExamplePrompt } from "@/lib/parseExamplePrompt";
import type { ExamplePromptType } from "@/type/promptType";

export async function GET(req: Request) {
	const { skip, limit } = await req.json();
	const promptHistory = await getPromptHistory(2, skip, limit);
	const examplePrompts: ExamplePromptType["examples"][] = [];
	for (const prompt of promptHistory) {
		examplePrompts.push(parseExamplePrompt(prompt));
	}
	return new Response(JSON.stringify(examplePrompts), {
		headers: { "Content-Type": "application/json" },
	});
}
