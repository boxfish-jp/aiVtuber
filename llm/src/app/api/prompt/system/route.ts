import { createData } from "@/lib/createData";
import { getLatestData } from "@/lib/getLatestData";
import { parseSystemPrompt } from "@/lib/parseSystemPrompt";

export async function POST(req: Request) {
	const { version, prompt, publish } = await req.json();
	const oldPromptData = await getLatestData(1);
	const oldPromptVersion = oldPromptData.version;
	if (publish) {
		await createData(oldPromptVersion + 1, 1, { system: prompt });
	} else {
		await createData(version, 1, { system: prompt });
	}
	return new Response("OK", { status: 200 });
}

export async function GET() {
	const promptData = await getLatestData(1);
	const systemPrompt = parseSystemPrompt(promptData);
	return new Response(systemPrompt);
}
