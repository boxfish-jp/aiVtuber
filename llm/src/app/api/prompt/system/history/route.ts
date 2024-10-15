import { getPromptHistory } from "@/lib/getPromptHistory";
import { parseSystemPrompt } from "@/lib/parseSystemPrompt";

export async function GET(req: Request) {
	const { skip, limit } = await req.json();
	const promptHistory = await getPromptHistory(1, skip, limit);
	const systemPrompts: string[] = [];
	for (const prompt of promptHistory) {
		systemPrompts.push(parseSystemPrompt(prompt));
	}
	return new Response(JSON.stringify(systemPrompts), {
		headers: { "Content-Type": "application/json" },
	});
}
