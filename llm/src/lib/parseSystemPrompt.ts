import type { SystemPromptType } from "@/type/promptType";
import type { Prompt } from "@prisma/client";

export const parseSystemPrompt = (promptData: Prompt) => {
	if (
		promptData.prompt &&
		typeof promptData.prompt === "object" &&
		"system" in promptData.prompt
	) {
		const systemPrompt = (promptData.prompt as SystemPromptType).system;
		return systemPrompt;
	}
	throw new Error("Invalid prompt data");
};
